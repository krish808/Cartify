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

describe("POST /api/auth/refresh", () => {
  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
  };

  const registerAndLogin = async () => {
      await request(app).post("/api/auth/register").send(testUser);

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: testUser.email, password: testUser.password });

  const setCookie = res.headers["set-cookie"];
  const refreshCookie = setCookie.find((c) => c.startsWith("refreshToken="));

  return { accessToken: res.body.accessToken, refreshCookie };
  };

  it("issues a new access token and rotates the refresh token on valid refresh", async () => {
    const { refreshCookie } = await registerAndLogin();

    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", refreshCookie);

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.headers["set-cookie"]).toBeDefined();

    const newRefreshCookie = res.headers["set-cookie"].find((c) =>
      c.startsWith("refreshToken="),
    );
    // ✅ this is the exact assertion that would have caught the decoded.id
    // vs decoded._id bug — a broken lookup returns 403, never gets here.
    expect(newRefreshCookie).not.toBe(refreshCookie);
  });

  it("rejects a reused (already-rotated) refresh token", async () => {
    const { refreshCookie } = await registerAndLogin();

    // first use — should succeed and rotate
    const firstRefresh = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", refreshCookie);
    expect(firstRefresh.status).toBe(200);

    // reuse the OLD token — should now fail
    const secondRefresh = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", refreshCookie);

    expect(secondRefresh.status).toBe(403);
    expect(secondRefresh.body.message).toMatch(/invalid refresh token/i);
  });

  it("rejects a missing refresh token", async () => {
    const res = await request(app).post("/api/auth/refresh");
    expect(res.status).toBe(401);
  });

  it("rejects a malformed/garbage refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", "refreshToken=this.is.garbage");

    expect(res.status).toBe(403);
  });
});

describe("POST /api/auth/register", () => {
  const newUser = {
    name: "New User",
    email: "newuser@example.com",
    password: "password123",
  };

  it("creates a user and returns an access token + refresh cookie", async () => {
    const res = await request(app).post("/api/auth/register").send(newUser);

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(newUser.email);
    expect(res.body.user.password).toBeUndefined(); // ✅ never leak the hash

    const setCookie = res.headers["set-cookie"];
    expect(setCookie.some((c) => c.startsWith("refreshToken="))).toBe(true);
  });

  it("hashes the password rather than storing it in plaintext", async () => {
    await request(app).post("/api/auth/register").send(newUser);

    const stored = await User.findOne({ email: newUser.email });
    expect(stored.password).not.toBe(newUser.password);
  });

  it("rejects registering the same email twice", async () => {
    await request(app).post("/api/auth/register").send(newUser);

    const res = await request(app).post("/api/auth/register").send(newUser);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it("defaults to 'customer' role for an invalid/unrecognized role", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...newUser, role: "superadmin" });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe("customer");
  });
});

describe("POST /api/auth/login", () => {
  const existingUser = {
    name: "Existing User",
    email: "existing@example.com",
    password: "correctpassword",
  };

  beforeEach(async () => {
    await request(app).post("/api/auth/register").send(existingUser);
  });

  it("logs in with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: existingUser.email,
      password: existingUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(existingUser.email);
  });

  it("rejects an incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: existingUser.email,
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
  });

  it("rejects a nonexistent email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "doesnotexist@example.com",
      password: "whatever",
    });

    expect(res.status).toBe(401);
  });

  it("gives the same error message for wrong password and unknown email", async () => {
    // ✅ security check: login errors shouldn't reveal whether an email
    // exists in the system (prevents user enumeration)
    const wrongPassRes = await request(app).post("/api/auth/login").send({
      email: existingUser.email,
      password: "wrongpassword",
    });

    const noUserRes = await request(app).post("/api/auth/login").send({
      email: "doesnotexist@example.com",
      password: "whatever",
    });

    expect(wrongPassRes.body.message).toBe(noUserRes.body.message);
  });
});

describe("POST /api/auth/logout", () => {
  const registerAndLogin = async () => {
    const user = {
      name: "Logout Test User",
      email: "logouttest@example.com",
      password: "password123",
    };
    await request(app).post("/api/auth/register").send(user);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });

    return {
      accessToken: res.body.accessToken,
      userId: res.body.user._id,
    };
  };

  it("clears the refresh token cookie and the DB record when logged in", async () => {
    const { accessToken, userId } = await registerAndLogin();

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);

    const clearedCookie = res.headers["set-cookie"]?.find((c) =>
      c.startsWith("refreshToken="),
    );
    expect(clearedCookie).toMatch(/Expires=Thu, 01 Jan 1970/);

    const user = await User.findById(userId);
    expect(user.refreshToken).toBeNull();
  });

  it("rejects logout without a valid access token", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(401);
  });
});