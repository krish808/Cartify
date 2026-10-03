import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
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

// ✅ Mints a real, valid access token directly — bypassing the login
// endpoint's bcrypt password check. This is the standard way to test
// role-gated routes (authorize("seller")) for roles that can't easily
// self-register through the normal register/login flow.
const createSellerWithToken = async () => {
  const seller = await User.create({
    name: "Seller",
    email: `seller-${Date.now()}-${Math.random()}@example.com`,
    password: "unused-never-logged-in-with",
    role: "seller",
  });

  const token = jwt.sign(
    { _id: seller._id, role: seller.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );

  return { seller, token };
};

const createOrderFor = async (userId, sellerId, overrides = {}) => {
  const product = await Product.create({
    name: "Test Product",
    price: 100,
    stock: 10,
    seller: sellerId,
  });

  return Order.create({
    user: userId,
    seller: sellerId,
    items: [{ product: product._id, quantity: 1, priceAtPurchase: 100 }],
    totalAmount: 100,
    ...overrides,
  });
};

describe("GET /api/orders/me", () => {
  it("returns only the logged-in user's orders", async () => {
    const { token, userId } = await createAuthedUser("buyer@example.com");
    const { userId: otherUserId } = await createAuthedUser("other@example.com");
    const { seller } = await createSellerWithToken();

    await createOrderFor(userId, seller._id);
    await createOrderFor(otherUserId, seller._id);

    const res = await request(app)
      .get("/api/orders/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].user).toBe(String(userId));
  });

  it("returns an empty array when the user has no orders", async () => {
    const { token } = await createAuthedUser("buyer@example.com");

    const res = await request(app)
      .get("/api/orders/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("populates product name, price, and images", async () => {
    const { token, userId } = await createAuthedUser("buyer@example.com");
    const { seller } = await createSellerWithToken();
    await createOrderFor(userId, seller._id);

    const res = await request(app)
      .get("/api/orders/me")
      .set("Authorization", `Bearer ${token}`);

    const product = res.body[0].items[0].product;
    expect(product.name).toBe("Test Product");
    expect(product.price).toBe(100);
    expect(product).toHaveProperty("images");
  });

  it("rejects an unauthenticated request", async () => {
    const res = await request(app).get("/api/orders/me");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/orders/seller", () => {
  it("returns only orders belonging to the logged-in seller", async () => {
    const { token: buyerToken, userId } = await createAuthedUser("buyer@example.com");
    const { seller: sellerA, token: sellerAToken } = await createSellerWithToken();
    const { seller: sellerB } = await createSellerWithToken();

    await createOrderFor(userId, sellerA._id);
    await createOrderFor(userId, sellerB._id);

    const res = await request(app)
      .get("/api/orders/seller")
      .set("Authorization", `Bearer ${sellerAToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].seller).toBe(String(sellerA._id));
  });

  it("rejects a non-seller (customer) from accessing seller orders", async () => {
    const { token } = await createAuthedUser("buyer@example.com");

    const res = await request(app)
      .get("/api/orders/seller")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it("rejects an unauthenticated request", async () => {
    const res = await request(app).get("/api/orders/seller");
    expect(res.status).toBe(401);
  });
});

describe("PATCH /api/orders/:id/status", () => {
  it("allows the owning seller to update order status", async () => {
    const { userId } = await createAuthedUser("buyer@example.com");
    const { seller, token } = await createSellerWithToken();
    const order = await createOrderFor(userId, seller._id);

    const res = await request(app)
      .patch(`/api/orders/${order._id}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "SHIPPED" });

    expect(res.status).toBe(200);
    expect(res.body.order.status).toBe("SHIPPED");

    const updated = await Order.findById(order._id);
    expect(updated.status).toBe("SHIPPED");
  });

  it("rejects a seller updating an order that isn't theirs", async () => {
    const { userId } = await createAuthedUser("buyer@example.com");
    const { seller: owningSeller } = await createSellerWithToken();
    const { token: otherSellerToken } = await createSellerWithToken();
    const order = await createOrderFor(userId, owningSeller._id);

    const res = await request(app)
      .patch(`/api/orders/${order._id}/status`)
      .set("Authorization", `Bearer ${otherSellerToken}`)
      .send({ status: "SHIPPED" });

    expect(res.status).toBe(403);
  });

  it("rejects a customer (non-seller) trying to update order status", async () => {
    const { token, userId } = await createAuthedUser("buyer@example.com");
    const { seller } = await createSellerWithToken();
    const order = await createOrderFor(userId, seller._id);

    const res = await request(app)
      .patch(`/api/orders/${order._id}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "SHIPPED" });

    expect(res.status).toBe(403); // role middleware rejects before reaching controller
  });

  it("rejects an invalid status value", async () => {
    const { userId } = await createAuthedUser("buyer@example.com");
    const { seller, token } = await createSellerWithToken();
    const order = await createOrderFor(userId, seller._id);

    const res = await request(app)
      .patch(`/api/orders/${order._id}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "BOGUS_STATUS" });

    expect(res.status).toBe(400);
  });

  it("rejects updating a nonexistent order", async () => {
    const { token } = await createSellerWithToken();
    const fakeId = "aaaaaaaaaaaaaaaaaaaaaaaa";

    const res = await request(app)
      .patch(`/api/orders/${fakeId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "SHIPPED" });

    expect(res.status).toBe(404);
  });
});