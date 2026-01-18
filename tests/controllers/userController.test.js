const request = require("supertest");
const app = require("../../src/app");
const User = require("../../src/models/userModel");

describe("User Controller", () => {
  describe("Register User", () => {
    it("registers a normal user", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({
          name: "User",
          email: "user@test.com",
          password: "password123",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.email).toBe("user@test.com");
      expect(res.body.data.role).toBe("user");
    });
  });

  describe("Register Admin", () => {
    it("fails with invalid admin secret", async () => {
      const res = await request(app)
        .post("/api/users/register-admin")
        .send({
          name: "Admin",
          email: "admin@test.com",
          password: "password123",
          admin_secret: "wrong",
        });

      expect(res.statusCode).toBe(403);
    });

    it("registers admin with valid secret", async () => {
      process.env.ADMIN_SECRET = "secret123";

      const res = await request(app)
        .post("/api/users/register-admin")
        .send({
          name: "Admin",
          email: "admin2@test.com",
          password: "password123",
          admin_secret: "secret123",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.role).toBe("admin");
    });
  });

  describe("Login", () => {
    it("fails with invalid credentials", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: "nope@test.com",
          password: "wrong",
        });

      expect(res.statusCode).toBe(401);
    });

    it("logs in successfully", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: "user@test.com",
          password: "password123",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });
  });

  describe("Get Me", () => {
    it("returns logged-in user profile", async () => {
      const login = await request(app)
        .post("/api/users/login")
        .send({
          email: "user@test.com",
          password: "password123",
        });

      const res = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${login.body.data.token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.email).toBe("user@test.com");
    });
  });
});
