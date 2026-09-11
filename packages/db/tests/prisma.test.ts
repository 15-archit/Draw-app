import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
} from "vitest";

import { prismaClient } from "../src";

describe("Prisma Database Integration Tests", () => {
  let userId: string;
  let userEmail: string;
  let roomId: number;
  let roomSlug: string;

  beforeAll(async () => {
    // Create a test user before running the tests
    userEmail = `test-${Date.now()}@example.com`;

    const user = await prismaClient.user.create({
      data: {
        email: userEmail,
        password: "hashed-password",
        username: `testuser-${Date.now()}`,
        name: "Test User",
      },
    });

    userId = user.id;

    // Create a test room
    roomSlug = `test-room-${Date.now()}`;

    const room = await prismaClient.room.create({
      data: {
        slug: roomSlug,
        adminId: userId,
      },
    });

    roomId = room.id;
  });

  it("should create and find a user by email", async () => {
    const user = await prismaClient.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    expect(user).not.toBeNull();
    expect(user?.id).toBe(userId);
    expect(user?.email).toBe(userEmail);
    expect(user?.name).toBe("Test User");
  });

  it("should enforce unique email", async () => {
    await expect(
      prismaClient.user.create({
        data: {
          email: userEmail,
          password: "another-password",
          username: `another-${Date.now()}`,
          name: "Another User",
        },
      }),
    ).rejects.toThrow();
  });

  it("should create a room for the user", async () => {
    const room = await prismaClient.room.findUnique({
      where: {
        id: roomId,
      },
    });

    expect(room).not.toBeNull();
    expect(room?.adminId).toBe(userId);
    expect(room?.slug).toBe(roomSlug);
  });

  it("should find a room with its admin", async () => {
    const room = await prismaClient.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        admin: true,
      },
    });

    expect(room).not.toBeNull();

    if (!room) {
      throw new Error("Room was not found");
    }

    expect(room.admin.id).toBe(userId);
    expect(room.admin.name).toBe("Test User");
  });

  it("should enforce unique room slug", async () => {
    await expect(
      prismaClient.room.create({
        data: {
          slug: roomSlug,
          adminId: userId,
        },
      }),
    ).rejects.toThrow();
  });

  it("should create a chat", async () => {
    const chat = await prismaClient.chat.create({
      data: {
        roomId: roomId,
        userId: userId,
        message: "Hello from integration test",
      },
    });

    expect(chat).toBeDefined();
    expect(chat.id).toBeTypeOf("number");
    expect(chat.roomId).toBe(roomId);
    expect(chat.userId).toBe(userId);
    expect(chat.message).toBe("Hello from integration test");

    // Remove this chat so the relationship test below creates its own data.
    await prismaClient.chat.delete({
      where: {
        id: chat.id,
      },
    });
  });

  it("should fetch chats with user and room relationships", async () => {
    const chat = await prismaClient.chat.create({
      data: {
        roomId: roomId,
        userId: userId,
        message: "Hello from relationship test",
      },
    });

    const chats = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      include: {
        user: true,
        room: true,
      },
    });

    expect(chats.length).toBeGreaterThan(0);

    const foundChat = chats.find((item) => item.id === chat.id);

    expect(foundChat).toBeDefined();

    if (!foundChat) {
      throw new Error("Chat was not found");
    }

    expect(foundChat.user.id).toBe(userId);
    expect(foundChat.room.id).toBe(roomId);
    expect(foundChat.message).toBe("Hello from relationship test");
  });

  afterAll(async () => {
    // Delete chats first because they depend on users and rooms.
    await prismaClient.chat.deleteMany({
      where: {
        roomId: roomId,
      },
    });

    // Delete room.
    await prismaClient.room.delete({
      where: {
        id: roomId,
      },
    });

    // Delete user.
    await prismaClient.user.delete({
      where: {
        id: userId,
      },
    });

    await prismaClient.$disconnect();
  });
});