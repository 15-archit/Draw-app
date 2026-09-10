import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
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

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

describe("Room API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /room", () => {
    it("should reject request without token", async () => {
      const response = await request(app)
        .post("/room")
        .send({
          name: "my-room",
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Unauthorized",
      });

      expect(prismaClient.room.create).not.toHaveBeenCalled();
    });

    it("should reject request with invalid token", async () => {
      vi.mocked(jwt.verify).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const response = await request(app)
        .post("/room")
        .set("Authorization", "invalid-token")
        .send({
          name: "my-room",
        });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        message: "Invalid token",
      });
    });

    it("should create a room with valid token", async () => {
      vi.mocked(jwt.verify).mockReturnValue({
        userId: "user-123",
      } as jwt.JwtPayload);

      vi.mocked(prismaClient.room.create).mockResolvedValue({
        id: 1,
        slug: "my-room",
        adminId: "user-123",
      } as never);

      const response = await request(app)
        .post("/room")
        .set("Authorization", "valid-token")
        .send({
          name: "my-room",
        });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        roomId: 1,
      });

      expect(prismaClient.room.create).toHaveBeenCalledWith({
        data: {
          slug: "my-room",
          adminId: "user-123",
        },
      });
    });

    it("should reject invalid room name", async () => {
      vi.mocked(jwt.verify).mockReturnValue({
        userId: "user-123",
      } as jwt.JwtPayload);

      const response = await request(app)
        .post("/room")
        .set("Authorization", "valid-token")
        .send({
          name: "a",
        });

      expect(response.body).toEqual({
        message: "Incorrect inputs",
      });

      expect(prismaClient.room.create).not.toHaveBeenCalled();
    });

    it("should return 500 when room creation fails", async () => {
      vi.mocked(jwt.verify).mockReturnValue({
        userId: "user-123",
      } as jwt.JwtPayload);

      vi.mocked(prismaClient.room.create).mockRejectedValue(
        new Error("Room already exists")
      );

      const response = await request(app)
        .post("/room")
        .set("Authorization", "valid-token")
        .send({
          name: "my-room",
        });

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        message: "Room creation failed",
      });
    });
  });

  describe("GET /room/:slug", () => {
    it("should return a room", async () => {
      const room = {
        id: 1,
        slug: "my-room",
        adminId: "user-123",
      };

      vi.mocked(prismaClient.room.findFirst).mockResolvedValue(
        room as never
      );

      const response = await request(app)
        .get("/room/my-room");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        room,
      });

      expect(prismaClient.room.findFirst).toHaveBeenCalledWith({
        where: {
          slug: "my-room",
        },
      });
    });

    it("should return null when room does not exist", async () => {
      vi.mocked(prismaClient.room.findFirst).mockResolvedValue(
        null
      );

      const response = await request(app)
        .get("/room/non-existent-room");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        room: null,
      });
    });
  });
});
