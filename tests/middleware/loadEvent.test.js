const request = require("supertest");
const app = require("../../src/app");
const Event = require("../../src/models/eventModel");
const User = require("../../src/models/userModel");
const jwt = require("jsonwebtoken");
const { getAdminToken } = require("../helpers/auth");

describe("loadEvent middleware", () => {
  let token;
  let eventId;
  let adminToken; 

  beforeAll(async () => {
    const user = await User.create({
      name: "Loader",
      email: "loader@test.com",
      password: "password123",
    });

    token = jwt.sign({ id: user._id, role: "admin" }, process.env.JWT_SECRET);
    adminToken = await getAdminToken();

    const event = await request(app)
          .post("/api/events")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            title: "Test Event",
            description: "Test desc",
            start_date: new Date(Date.now() + 3600000),
            end_date: new Date(Date.now() + 7200000),
            capacity: 100,
          });

    eventId = event.body.data.event_id;
  });

  it("loads event and attaches to req", async () => {
    const res = await request(app)
      .delete(`/api/events/${eventId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    // delete route uses loadEvent internally
    expect(res.statusCode).toBe(204);
  });

  it("returns 404 when event does not exist", async () => {
    const res = await request(app)
      .delete("/api/events/nonexistent123")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
