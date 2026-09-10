
import { describe, it, expect, vi, beforeEach,MockedFunction } from "vitest";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { middleware } from "../../src/middleware";

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}));


describe("Auth Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      headers: {},
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    next = vi.fn();
  });

  it("should return 401 when authorization token is missing", () => {
    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should call next when token is valid", () => {
    req.headers = {
      authorization: "valid-token",
    };

    vi.mocked(jwt.verify).mockReturnValue({
      userId: "user-123",
    } as jwt.JwtPayload);

    middleware(req as Request, res as Response, next);

    expect(jwt.verify).toHaveBeenCalled();

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 401 when token is invalid", () => {
    req.headers = {
      authorization: "invalid-token",
    };

    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid token",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should attach userId to request when token is valid", () => {
    req.headers = {
      authorization: "valid-token",
    };

    vi.mocked(jwt.verify).mockReturnValue({
      userId: "user-456",
    } as jwt.JwtPayload);

    middleware(req as Request, res as Response, next);

    expect((req as Request & { userId?: string }).userId).toBe("user-456");

    expect(next).toHaveBeenCalled();
  });
});
