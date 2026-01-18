const request = require("supertest");
const app = require("../../src/app");
const User = require("../../src/models/userModel");
const Event = require("../../src/models/eventModel");
const jwt = require("jsonwebtoken");

describe("Event Routes", () => {
  let adminToken, userToken, eventId;

  beforeAll(async () => {
    const admin = await User.create({
      name: "Admin",
      email: "admin@t.com",
      password: "password123",
      role: "admin",
    });

    const user = await User.create({
      name: "User",
      email: "user@t.com",
      password: "password123",
    });

    adminToken = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET);
    userToken = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET);

    const event = await Event.create({
      title: "Route Event",
      startDateTime: new Date(Date.now() + 3600000),
      endDateTime: new Date(Date.now() + 7200000),
      createdBy: admin._id,
    });

    eventId = event.event_id;
  });

  it("blocks create event for non-admin", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "Fail",
        start_date: new Date(Date.now() + 3600000),
        end_date: new Date(Date.now() + 7200000),
      });

    expect(res.statusCode).toBe(403);
  });

  it("allows admin to create event", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "New Event",
        start_date: new Date(Date.now() + 3600000),
        end_date: new Date(Date.now() + 7200000),
      });

    expect(res.statusCode).toBe(201);
  });

  it("gets all events (auth required)", async () => {
    const res = await request(app)
      .get("/api/events")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("gets event by id", async () => {
    const res = await request(app)
      .get(`/api/events/${eventId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("registers and deregisters for event", async () => {
    let res = await request(app)
      .post(`/api/events/${eventId}/register`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);

    res = await request(app)
      .delete(`/api/events/${eventId}/register`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("allows admin to delete event", async () => {
    const res = await request(app)
      .delete(`/api/events/${eventId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });
});
