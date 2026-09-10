import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

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

describe("Chat API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /chats/:roomId", () => {
    it("should return chat messages", async () => {
      const messages = [
        {
          id: 2,
          roomId: 1,
          message: "Hello",
          userId: "user-123",
        },
        {
          id: 1,
          roomId: 1,
          message: "Hi",
          userId: "user-456",
        },
      ];

      vi.mocked(prismaClient.chat.findMany).mockResolvedValue(
        messages as never
      );

      const response = await request(app)
        .get("/chats/1");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        messages,
      });

      expect(prismaClient.chat.findMany).toHaveBeenCalledWith({
        where: {
          roomId: 1,
        },
        orderBy: {
          id: "desc",
        },
        take: 1000,
      });
    });

    it("should return empty messages when database query fails", async () => {
      vi.mocked(prismaClient.chat.findMany).mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .get("/chats/1");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        messages: [],
      });
    });

    it("should convert roomId from string to number", async () => {
      vi.mocked(prismaClient.chat.findMany).mockResolvedValue(
        [] as never
      );

      await request(app)
        .get("/chats/25");

      expect(prismaClient.chat.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            roomId: 25,
          },
        })
      );
    });
  });
});
