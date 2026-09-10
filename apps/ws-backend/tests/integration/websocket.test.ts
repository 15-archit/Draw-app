import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import WebSocket from "ws";
import { createWebSocketServer } from "../../src/index";
import { checkUser } from "../../src/auth";
import { prismaClient } from "@repo/db/client";

vi.mock("../../src/auth", () => ({
  checkUser: vi.fn(),
}));

vi.mock("@repo/db/client", () => ({
  prismaClient: {
    chat: {
      create: vi.fn(),
    },
  },
}));

describe("WebSocket server", () => {
  let server: ReturnType<typeof createWebSocketServer>;

  beforeEach(async () => {
    vi.mocked(checkUser).mockReturnValue("user-123");

    vi.mocked(prismaClient.chat.create).mockResolvedValue({
      id: 1,
      roomId: 1,
      message: "Hello",
      userId: "user-123",
    } as any);

    server = createWebSocketServer(8081);

    await new Promise<void>((resolve) => {
      server.on("listening", () => resolve());
    });
  });

  afterEach(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });

    vi.clearAllMocks();
  });

  it("should accept a connection with a valid token", async () => {
    const client = new WebSocket(
      "ws://localhost:8081?token=valid-token"
    );

    await new Promise<void>((resolve, reject) => {
      client.on("open", () => {
        resolve();
      });

      client.on("error", reject);
    });

    expect(client.readyState).toBe(WebSocket.OPEN);

    client.close();
  });

  it("should reject a connection with an invalid token", async () => {
    vi.mocked(checkUser).mockReturnValue(null);

    const client = new WebSocket(
      "ws://localhost:8081?token=invalid-token"
    );

    await new Promise<void>((resolve) => {
      client.on("close", () => resolve());
      client.on("error", () => resolve());
    });

    expect(client.readyState).not.toBe(WebSocket.OPEN);
  });

  it("should add user to a room when join_room is received", async () => {
    const client = new WebSocket(
      "ws://localhost:8081?token=valid-token"
    );

    await new Promise<void>((resolve, reject) => {
      client.on("open", () => resolve());
      client.on("error", reject);
    });

    client.send(
      JSON.stringify({
        type: "join_room",
        roomId: 1,
      })
    );

    // Wait for the server to process the message
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(client.readyState).toBe(WebSocket.OPEN);

    client.close();
  });

  it("should save chat message to database", async () => {
    const client = new WebSocket(
      "ws://localhost:8081?token=valid-token"
    );

    await new Promise<void>((resolve, reject) => {
      client.on("open", () => resolve());
      client.on("error", reject);
    });

    client.send(
      JSON.stringify({
        type: "chat",
        roomId: 1,
        message: "Hello",
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(prismaClient.chat.create).toHaveBeenCalledWith({
      data: {
        roomId: 1,
        message: "Hello",
        userId: "user-123",
      },
    });

    client.close();
  });

  it("should broadcast chat message to users in the same room", async () => {
    const clientA = new WebSocket(
      "ws://localhost:8081?token=token-a"
    );

    const clientB = new WebSocket(
      "ws://localhost:8081?token=token-b"
    );

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        clientA.on("open", () => resolve());
        clientA.on("error", reject);
      }),
      new Promise<void>((resolve, reject) => {
        clientB.on("open", () => resolve());
        clientB.on("error", reject);
      }),
    ]);

    // Both clients join room 1
    clientA.send(
      JSON.stringify({
        type: "join_room",
        roomId: 1,
      })
    );

    clientB.send(
      JSON.stringify({
        type: "join_room",
        roomId: 1,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const messagePromise = new Promise<string>((resolve) => {
      clientB.on("message", (data) => {
        resolve(data.toString());
      });
    });

    clientA.send(
      JSON.stringify({
        type: "chat",
        roomId: 1,
        message: "Hello everyone",
      })
    );

    const receivedMessage = await messagePromise;

    expect(JSON.parse(receivedMessage)).toEqual({
      type: "chat",
      message: "Hello everyone",
      roomId: 1,
    });

    clientA.close();
    clientB.close();
  });

  it("should not broadcast chat to users in another room", async () => {
    const clientA = new WebSocket(
      "ws://localhost:8081?token=token-a"
    );

    const clientB = new WebSocket(
      "ws://localhost:8081?token=token-b"
    );

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        clientA.on("open", () => resolve());
        clientA.on("error", reject);
      }),
      new Promise<void>((resolve, reject) => {
        clientB.on("open", () => resolve());
        clientB.on("error", reject);
      }),
    ]);

    // Client A joins room 1
    clientA.send(
      JSON.stringify({
        type: "join_room",
        roomId: 1,
      })
    );

    // Client B joins room 2
    clientB.send(
      JSON.stringify({
        type: "join_room",
        roomId: 2,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const receivedMessages: string[] = [];

    clientB.on("message", (data) => {
      receivedMessages.push(data.toString());
    });

    clientA.send(
      JSON.stringify({
        type: "chat",
        roomId: 1,
        message: "Private room message",
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(receivedMessages).toHaveLength(0);

    clientA.close();
    clientB.close();
  });

  it("should remove user from room when leave_room is received", async () => {
    const clientA = new WebSocket(
      "ws://localhost:8081?token=token-a"
    );

    const clientB = new WebSocket(
      "ws://localhost:8081?token=token-b"
    );

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        clientA.on("open", () => resolve());
        clientA.on("error", reject);
      }),
      new Promise<void>((resolve, reject) => {
        clientB.on("open", () => resolve());
        clientB.on("error", reject);
      }),
    ]);

    // Both join room 1
    clientA.send(
      JSON.stringify({
        type: "join_room",
        roomId: 1,
      })
    );

    clientB.send(
      JSON.stringify({
        type: "join_room",
        roomId: 1,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Client B leaves room 1
    clientB.send(
      JSON.stringify({
        type: "leave_room",
        room: 1,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

    const receivedMessages: string[] = [];

    clientB.on("message", (data) => {
      receivedMessages.push(data.toString());
    });

    // Client A sends message to room 1
    clientA.send(
      JSON.stringify({
        type: "chat",
        roomId: 1,
        message: "After leaving",
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    // B should NOT receive the message
    expect(receivedMessages).toHaveLength(0);

    clientA.close();
    clientB.close();
  });
});
