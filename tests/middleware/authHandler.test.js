const request = require("supertest");
const app = require("../../src/app");
const User = require("../../src/models/userModel");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "testsecret";

describe("Auth Middleware", () => {
  let user;
  let token;

  beforeAll(async () => {
    user = await User.create({
      name: "Auth User",
      email: "auth@test.com",
      password: "password123",
    });

    token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
  });

  it("fails when authorization header is missing", async () => {
    const res = await request(app).get("/api/users/profile");
    expect(res.statusCode).toBe(401);
  });

  it("fails with malformed authorization header", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", "Token abc");

    expect(res.statusCode).toBe(401);
  });

  it("fails with invalid token", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(401);
  });

  it("fails if user no longer exists", async () => {
    const fakeToken = jwt.sign({ id: "507f1f77bcf86cd799439011" }, JWT_SECRET);

    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(401);
  });

  it("passes with valid token", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe("auth@test.com");
  });

  it("handles expired token", async () => {
    const expiredToken = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "-1s" }
    );

    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(res.statusCode).toBe(401);
  });
});
