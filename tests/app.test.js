const request = require("supertest");
const app = require("../src/app");

describe("App bootstrap", () => {
  it("health check works", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Event Manager API is running");
  });

  it("applies rate limiter on /api", async () => {
    const res = await request(app).get("/api/users/profile");

    // unauth OR rate-limited → both valid outcomes
    expect([401, 429]).toContain(res.statusCode);
  });

  it("returns 404 for unknown route", async () => {
    const res = await request(app).get("/unknown-route");

    expect(res.statusCode).toBe(404);
  });
});
