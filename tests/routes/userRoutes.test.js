const request = require("supertest");
const app = require("../../src/app");
const User = require("../../src/models/userModel");
const jwt = require("jsonwebtoken");

describe("User Routes", () => {
  let token;

  beforeAll(async () => {
    const user = await User.create({
      name: "Route User",
      email: "route@test.com",
      password: "password123",
    });

    token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
  });

  it("POST /register registers user", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({
        name: "New User",
        email: "new@test.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(201);
  });

  it("POST /login logs in user", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: "new@test.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it("GET /profile requires auth", async () => {
    const res = await request(app).get("/api/users/profile");
    expect(res.statusCode).toBe(401);
  });

  it("GET /profile returns user when authenticated", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe("route@test.com");
  });

  it("GET /events is protected and wired", async () => {
    const res = await request(app)
      .get("/api/users/events")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
