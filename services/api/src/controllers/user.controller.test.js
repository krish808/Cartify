import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";
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

const createAuthedUser = async (email = "user@example.com") => {
  await request(app).post("/api/auth/register").send({
    name: "Original Name",
    email,
    password: "password123",
  });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password: "password123" });

  const user = await User.findOne({ email });
  return { token: res.body.accessToken, userId: user._id };
};

const patchProfile = (token, body) =>
  request(app)
    .patch("/api/users/me")
    .set("Authorization", `Bearer ${token}`)
    .send(body);

describe("PATCH /api/users/me", () => {
  it("updates the name", async () => {
    const { token, userId } = await createAuthedUser();

    const res = await patchProfile(token, { name: "New Name" });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe("New Name");

    const stored = await User.findById(userId);
    expect(stored.name).toBe("New Name");
  });

  it("updates the email, and login then works with the new email only", async () => {
    const { token } = await createAuthedUser("old@example.com");

    const res = await patchProfile(token, { email: "new@example.com" });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("new@example.com");

    const loginNew = await request(app)
      .post("/api/auth/login")
      .send({ email: "new@example.com", password: "password123" });
    expect(loginNew.status).toBe(200);

    const loginOld = await request(app)
      .post("/api/auth/login")
      .send({ email: "old@example.com", password: "password123" });
    expect(loginOld.status).toBe(401);
  });

  it("updates name and email together", async () => {
    const { token } = await createAuthedUser();

    const res = await patchProfile(token, {
      name: "Both Changed",
      email: "both@example.com",
    });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe("Both Changed");
    expect(res.body.user.email).toBe("both@example.com");
  });

  it("trims surrounding whitespace", async () => {
    const { token } = await createAuthedUser();

    const res = await patchProfile(token, { name: "  Padded Name  " });

    expect(res.body.user.name).toBe("Padded Name");
  });

  it("ignores fields outside the whitelist (no privilege escalation or password overwrite)", async () => {
    const { token, userId } = await createAuthedUser();

    const res = await patchProfile(token, {
      name: "Sneaky",
      role: "admin",
      password: "hacked",
    });

    expect(res.status).toBe(200);

    const stored = await User.findById(userId);
    expect(stored.role).toBe("customer");

    // the original password must still work
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@example.com", password: "password123" });
    expect(login.status).toBe(200);
  });

  it("never returns the password hash or refresh token", async () => {
    const { token } = await createAuthedUser();

    const res = await patchProfile(token, { name: "New Name" });

    expect(res.body.user).not.toHaveProperty("password");
    expect(res.body.user).not.toHaveProperty("refreshToken");
  });

  it("rejects an empty update", async () => {
    const { token } = await createAuthedUser();

    const res = await patchProfile(token, {});

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/name or email/i);
  });

  it("rejects an invalid email", async () => {
    const { token } = await createAuthedUser();

    const res = await patchProfile(token, { email: "not-an-email" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid email/i);
  });

  it("rejects a name that is too short", async () => {
    const { token } = await createAuthedUser();

    const res = await patchProfile(token, { name: "A" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/at least 2/i);
  });

  it("rejects an email already used by another account", async () => {
    await createAuthedUser("taken@example.com");
    const { token, userId } = await createAuthedUser("me@example.com");

    const res = await patchProfile(token, { email: "taken@example.com" });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already in use/i);

    const stored = await User.findById(userId);
    expect(stored.email).toBe("me@example.com");
  });

  it("allows submitting your own current email", async () => {
    const { token } = await createAuthedUser("me@example.com");

    const res = await patchProfile(token, {
      name: "Renamed",
      email: "me@example.com",
    });

    expect(res.status).toBe(200);
  });

  it("rejects an unauthenticated request", async () => {
    const res = await request(app)
      .patch("/api/users/me")
      .send({ name: "Whoever" });

    expect(res.status).toBe(401);
  });
});