const request = require("supertest");
const express = require("express");
const apiLimiter = require("../../src/middleware/rateLimiter");

describe("rateLimiter middleware", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(apiLimiter);
    app.get("/test", (req, res) => res.status(200).json({ ok: true }));
  });

  it("allows requests under limit", async () => {
    const res = await request(app).get("/test");
    expect(res.statusCode).toBe(200);
  });

  it("blocks requests over limit", async () => {
    let res;

    // exceed limit
    for (let i = 0; i < 101; i++) {
      res = await request(app).get("/test");
    }

    expect(res.statusCode).toBe(429);
    expect(res.body.message).toBe(
      "Too many requests, please try again later"
    );
  });
});
