
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import app from "../../src/index";
import { prismaClient } from "@repo/db/client";

vi.mock("@repo/db/client", () => ({
  prismaClient: {
    user: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    room: {
      create: vi.fn(),
      findFirst: vi.fn(),
    },
    chat: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

describe("Authentication API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /signup", () => {
    it("should create a new user", async () => {
      vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);

      vi.mocked(prismaClient.user.create).mockResolvedValue({
        id: "user-123",
        username: "archit",
        email: "archit@example.com",
        password: "hashed-password",
        name: "Archit",
      } as never);

      const response = await request(app)
        .post("/signup")
        .send({
          username: "archit",
          email: "archit@example.com",
          password: "password123",
          name: "Archit",
        });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        userId: "user-123",
      });

      expect(prismaClient.user.create).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(
        "password123",
        10
      );
    });

    it("should reject invalid input", async () => {
      const response = await request(app)
        .post("/signup")
        .send({
          username: "a",
          email: "invalid-email",
          password: "123",
        });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        message: "Incorrect inputs",
      });

      expect(prismaClient.user.create).not.toHaveBeenCalled();
    });

    it("should return 500 when database creation fails", async () => {
      vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);

      vi.mocked(prismaClient.user.create).mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .post("/signup")
        .send({
          username: "archit",
          email: "archit@example.com",
          password: "password123",
          name: "Archit",
        });

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        message: "Signup failed",
      });
    });
  });

  describe("POST /signin", () => {
    const mockUser = {
      id: "user-123",
      username: "archit",
      email: "archit@example.com",
      password: "hashed-password",
      name: "Archit",
    };

    it("should sign in with valid credentials", async () => {
      vi.mocked(prismaClient.user.findMany).mockResolvedValue(
        [mockUser] as never
      );

      vi.mocked(prismaClient.user.findFirst).mockResolvedValue(
        mockUser as never
      );

      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      vi.mocked(jwt.sign).mockReturnValue("test-jwt-token" as never);

      const response = await request(app)
        .post("/signin")
        .send({
          email: "archit@example.com",
          password: "password123",
        });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        username: "Archit",
        userId: "user-123",
        token: "test-jwt-token",
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashed-password"
      );

      expect(jwt.sign).toHaveBeenCalled();
    });

    it("should return 403 when user does not exist", async () => {
      vi.mocked(prismaClient.user.findMany).mockResolvedValue(
        [] as never
      );

      vi.mocked(prismaClient.user.findFirst).mockResolvedValue(
        null
      );

      const response = await request(app)
        .post("/signin")
        .send({
          email: "unknown@example.com",
          password: "password123",
        });

      expect(response.status).toBe(403);

      expect(response.body).toEqual({
        message: "Incorrect email or username",
      });
    });

    it("should return 403 when password is incorrect", async () => {
      vi.mocked(prismaClient.user.findMany).mockResolvedValue(
        [mockUser] as never
      );

      vi.mocked(prismaClient.user.findFirst).mockResolvedValue(
        mockUser as never
      );

      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      const response = await request(app)
        .post("/signin")
        .send({
          email: "archit@example.com",
          password: "wrong-password",
        });

      expect(response.status).toBe(403);

      expect(response.body).toEqual({
        message: "Incorrect Credentials",
      });

      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it("should reject invalid signin input", async () => {
      const response = await request(app)
        .post("/signin")
        .send({
          email: "invalid-email",
          password: "",
        });

      expect(response.body).toEqual({
        message: "Incorrect inputs",
      });

      expect(prismaClient.user.findFirst).not.toHaveBeenCalled();
    });
  });
});

