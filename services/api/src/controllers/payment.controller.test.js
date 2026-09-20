import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import {
  connectTestDb,
  disconnectTestDb,
  clearTestDb,
} from "../test/setupTestDb.js";

beforeAll(async () => {
  await connectTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

const createAuthedUser = async (email) => {
  await request(app).post("/api/auth/register").send({
    name: "Test User",
    email,
    password: "password123",
  });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password: "password123" });

  const user = await User.findOne({ email });
  return { token: res.body.accessToken, userId: user._id };
};

const createOrderFor = async (userId) => {
  const seller = await User.create({
    name: "Seller",
    email: `seller-${Date.now()}-${Math.random()}@example.com`,
    password: "unused",
    role: "seller",
  });
  const product = await Product.create({
    name: "Product",
    price: 100,
    stock: 10,
    seller: seller._id,
  });

  return Order.create({
    user: userId,
    seller: seller._id,
    items: [{ product: product._id, quantity: 1, priceAtPurchase: 100 }],
    totalAmount: 100,
  });
};

describe("POST /api/payments", () => {
  it("creates a payment for the user's own order", async () => {
    const { token, userId } = await createAuthedUser("buyer@example.com");
    const order = await createOrderFor(userId);

    const res = await request(app)
      .post("/api/payments")
      .set("Authorization", `Bearer ${token}`)
      .send({ orderId: order._id, method: "COD" });

    expect(res.status).toBe(201);
    expect(res.body.amount).toBe(100);
    expect(res.body.status).toBe("PENDING");
  });

  it("rejects creating a payment for someone else's order", async () => {
    const { userId: ownerId } = await createAuthedUser("owner@example.com");
    const { token: attackerToken } = await createAuthedUser("attacker@example.com");
    const order = await createOrderFor(ownerId);

    const res = await request(app)
      .post("/api/payments")
      .set("Authorization", `Bearer ${attackerToken}`)
      .send({ orderId: order._id });

    expect(res.status).toBe(403);
  });
});

describe("PATCH /api/payments/:paymentId/pay", () => {
  it("marks the user's own payment as paid", async () => {
    const { token, userId } = await createAuthedUser("buyer@example.com");
    const order = await createOrderFor(userId);
    const payment = await Payment.create({
      order: order._id,
      user: userId,
      amount: 100,
    });

    const res = await request(app)
      .patch(`/api/payments/${payment._id}/pay`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    const updated = await Payment.findById(payment._id);
    expect(updated.status).toBe("PAID");

    const updatedOrder = await Order.findById(order._id);
    expect(updatedOrder.status).toBe("PAID");
    expect(updatedOrder.paymentStatus).toBe("PAID");
  });

  it("rejects marking someone else's payment as paid", async () => {
    const { userId: ownerId } = await createAuthedUser("owner@example.com");
    const { token: attackerToken } = await createAuthedUser("attacker@example.com");
    const order = await createOrderFor(ownerId);
    const payment = await Payment.create({
      order: order._id,
      user: ownerId,
      amount: 100,
    });

    const res = await request(app)
      .patch(`/api/payments/${payment._id}/pay`)
      .set("Authorization", `Bearer ${attackerToken}`);

    expect(res.status).toBe(403);

    const unchanged = await Payment.findById(payment._id);
    expect(unchanged.status).toBe("PENDING"); // ✅ confirms the attack didn't work
  });

  it("rejects marking an already-paid payment as paid again", async () => {
    const { token, userId } = await createAuthedUser("buyer@example.com");
    const order = await createOrderFor(userId);
    const payment = await Payment.create({
      order: order._id,
      user: userId,
      amount: 100,
      status: "PAID",
    });

    const res = await request(app)
      .patch(`/api/payments/${payment._id}/pay`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already completed/i);
  });
});

describe("POST /api/payments/confirm", () => {
  it("confirms payment for the user's own order", async () => {
    const { token, userId } = await createAuthedUser("buyer@example.com");
    const order = await createOrderFor(userId);
    const payment = await Payment.create({
      order: order._id,
      user: userId,
      amount: 100,
    });

    const res = await request(app)
      .post("/api/payments/confirm")
      .set("Authorization", `Bearer ${token}`)
      .send({ paymentId: payment._id, transactionId: "txn_123" });

    expect(res.status).toBe(200);
    expect(res.body.payment.status).toBe("PAID");
    expect(res.body.order.status).toBe("PAID");
  });

  it("rejects confirming someone else's payment", async () => {
    const { userId: ownerId } = await createAuthedUser("owner@example.com");
    const { token: attackerToken } = await createAuthedUser("attacker@example.com");
    const order = await createOrderFor(ownerId);
    const payment = await Payment.create({
      order: order._id,
      user: ownerId,
      amount: 100,
    });

    const res = await request(app)
      .post("/api/payments/confirm")
      .set("Authorization", `Bearer ${attackerToken}`)
      .send({ paymentId: payment._id, transactionId: "txn_hacked" });

    expect(res.status).toBe(403);
  });
});