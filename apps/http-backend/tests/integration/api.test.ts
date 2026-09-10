import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../../src/index";

describe("Root API", () => {
  it("should return the backend welcome message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "Hello from doodle-deck's http-backend!",
    });
  });
});
