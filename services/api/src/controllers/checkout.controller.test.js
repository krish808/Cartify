import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Coupon from "../models/Coupon.js";
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

// ✅ helper: register + login a buyer, return their access token
const createAuthedUser = async (email = "buyer@example.com") => {
  await request(app).post("/api/auth/register").send({
    name: "Buyer",
    email,
    password: "password123",
  });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password: "password123" });

  return res.body.accessToken;
};

// ✅ helper: create a seller user directly (no need to go through auth API)
const createSeller = async () => {
  return User.create({
    name: "Seller",
    email: `seller-${Date.now()}-${Math.random()}@example.com`,
    password: "hashed-not-used-in-tests",
    role: "seller",
  });
};

const createProduct = async (sellerId, overrides = {}) => {
  return Product.create({
    name: "Test Product",
    price: 100,
    stock: 10,
    seller: sellerId,
    ...overrides,
  });
};

describe("POST /api/checkout", () => {
  it("rejects checkout with an empty cart", async () => {
    const token = await createAuthedUser();

    const res = await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/cart is empty/i);
  });

  it("rejects checkout when a product has insufficient stock", async () => {
    const token = await createAuthedUser();
    const seller = await createSeller();
    const product = await createProduct(seller._id, { stock: 1 });

    const user = await User.findOne({ email: "buyer@example.com" });
    await Cart.create({
      user: user._id,
      items: [{ product: product._id, quantity: 5 }],
    });

    const res = await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/insufficient stock/i);
  });

  it("creates a single order for a single-seller cart", async () => {
    const token = await createAuthedUser();
    const seller = await createSeller();
    const product = await createProduct(seller._id, { price: 100, stock: 10 });

    const user = await User.findOne({ email: "buyer@example.com" });
    await Cart.create({
      user: user._id,
      items: [{ product: product._id, quantity: 2 }],
    });

    const res = await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(201);
    expect(res.body.orders).toHaveLength(1);
    expect(res.body.orders[0].totalAmount).toBe(200);
    expect(res.body.payments).toHaveLength(1);
    expect(res.body.payments[0].status).toBe("PENDING");
  });

  it("splits a multi-seller cart into one order per seller", async () => {
    const token = await createAuthedUser();
    const sellerA = await createSeller();
    const sellerB = await createSeller();
    const productA = await createProduct(sellerA._id, { price: 100 });
    const productB = await createProduct(sellerB._id, { price: 50 });

    const user = await User.findOne({ email: "buyer@example.com" });
    await Cart.create({
      user: user._id,
      items: [
        { product: productA._id, quantity: 1 },
        { product: productB._id, quantity: 2 },
      ],
    });

    const res = await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(201);
    expect(res.body.orders).toHaveLength(2);

    const sellerIds = res.body.orders.map((o) => o.seller);
    expect(sellerIds).toContain(String(sellerA._id));
    expect(sellerIds).toContain(String(sellerB._id));

    const totals = res.body.orders.map((o) => o.totalAmount).sort();
    expect(totals).toEqual([100, 100]); // productA: 100*1, productB: 50*2
  });

  it("reduces product stock after a successful checkout", async () => {
    const token = await createAuthedUser();
    const seller = await createSeller();
    const product = await createProduct(seller._id, { stock: 10 });

    const user = await User.findOne({ email: "buyer@example.com" });
    await Cart.create({
      user: user._id,
      items: [{ product: product._id, quantity: 3 }],
    });

    await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.stock).toBe(7);
  });

  it("clears the cart after a successful checkout", async () => {
    const token = await createAuthedUser();
    const seller = await createSeller();
    const product = await createProduct(seller._id);

    const user = await User.findOne({ email: "buyer@example.com" });
    await Cart.create({
      user: user._id,
      items: [{ product: product._id, quantity: 1 }],
    });

    await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    const cart = await Cart.findOne({ user: user._id });
    expect(cart).toBeNull();
  });

  it("applies a valid coupon to a single-seller order", async () => {
    const token = await createAuthedUser();
    const seller = await createSeller();
    const product = await createProduct(seller._id, { price: 200 });

    const user = await User.findOne({ email: "buyer@example.com" });
    await Cart.create({
      user: user._id,
      items: [{ product: product._id, quantity: 1 }],
    });

    await Coupon.create({
      code: "SAVE10",
      isActive: true,
      expiresAt: new Date(Date.now() + 86400000),
      minOrderAmount: 100,
      discountType: "PERCENT",
      discountValue: 10,
    });

    const res = await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${token}`)
      .send({ couponCode: "save10" }); // lowercase, should be normalized

    expect(res.status).toBe(201);
    expect(res.body.orders[0].discount).toBe(20); // 10% of 200
    expect(res.body.orders[0].totalAmount).toBe(180);
  });

  it("rejects a coupon on a multi-seller cart", async () => {
    const token = await createAuthedUser();
    const sellerA = await createSeller();
    const sellerB = await createSeller();
    const productA = await createProduct(sellerA._id);
    const productB = await createProduct(sellerB._id);

    const user = await User.findOne({ email: "buyer@example.com" });
    await Cart.create({
      user: user._id,
      items: [
        { product: productA._id, quantity: 1 },
        { product: productB._id, quantity: 1 },
      ],
    });

    await Coupon.create({
      code: "SAVE10",
      isActive: true,
      expiresAt: new Date(Date.now() + 86400000),
      minOrderAmount: 0,
      discountType: "PERCENT",
      discountValue: 10,
    });

    const res = await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${token}`)
      .send({ couponCode: "SAVE10" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/single seller/i);
  });

  it("rejects an invalid coupon code", async () => {
    const token = await createAuthedUser();
    const seller = await createSeller();
    const product = await createProduct(seller._id);

    const user = await User.findOne({ email: "buyer@example.com" });
    await Cart.create({
      user: user._id,
      items: [{ product: product._id, quantity: 1 }],
    });

    const res = await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${token}`)
      .send({ couponCode: "DOESNOTEXIST" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid coupon/i);
  });

  it("rejects checkout without authentication", async () => {
    const res = await request(app).post("/api/checkout").send({});
    expect(res.status).toBe(401);
  });
});