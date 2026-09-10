import { describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import { checkUser } from "../../src/auth";

describe("checkUser", () => {
  it("should return userId for a valid token", () => {
    vi.spyOn(jwt, "verify").mockImplementation(() => {
  return {
    userId: "user-123",
  } as jwt.JwtPayload;
});

    const result = checkUser("valid-token");

    expect(result).toBe("user-123");

    vi.restoreAllMocks();
  });

  it("should return null when token is invalid", () => {
    vi.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const result = checkUser("invalid-token");

    expect(result).toBeNull();

    vi.restoreAllMocks();
  });

  it("should return null when decoded token is a string", () => {
    vi.spyOn(jwt, "verify").mockImplementation(() => {
  return "some-string";
});

    const result = checkUser("valid-token");

    expect(result).toBeNull();

    vi.restoreAllMocks();
  });

  it("should return null when token does not contain userId", () => {
    vi.spyOn(jwt, "verify").mockImplementation(() => {
  return {
    email: "test@example.com",
  } as jwt.JwtPayload;
});

    const result = checkUser("valid-token");

    expect(result).toBeNull();

    vi.restoreAllMocks();
  });
});