import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { errorHandler } from "./error.middleware.js";
import AppError from "../utils/AppError.js";

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("errorHandler middleware", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.restoreAllMocks();
  });

  it("hides the stack trace when NODE_ENV is production", () => {
    process.env.NODE_ENV = "production";
    const err = new Error("Something broke");
    const res = mockRes();

    errorHandler(err, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ stack: null }),
    );
  });

  it("includes the stack trace when NODE_ENV is not production", () => {
    process.env.NODE_ENV = "development";
    const err = new Error("Something broke");
    const res = mockRes();

    errorHandler(err, {}, res, () => {});

    const jsonArg = res.json.mock.calls[0][0];
    expect(jsonArg.stack).toBeTruthy();
    expect(jsonArg.stack).toContain("Error: Something broke");
  });

  it("uses the AppError's statusCode when present", () => {
    const err = new AppError("Not found", 404);
    const res = mockRes();

    errorHandler(err, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("defaults to 500 for a plain, unexpected error", () => {
    const err = new Error("Unexpected");
    const res = mockRes();

    errorHandler(err, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("logs 500-level errors to the console", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const err = new Error("Server exploded");
    const res = mockRes();

    errorHandler(err, {}, res, () => {});

    expect(consoleSpy).toHaveBeenCalledWith(err);
  });

  it("does NOT log 4xx client errors to the console", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const err = new AppError("Bad request", 400);
    const res = mockRes();

    errorHandler(err, {}, res, () => {});

    expect(consoleSpy).not.toHaveBeenCalled();
  });
});