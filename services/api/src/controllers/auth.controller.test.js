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