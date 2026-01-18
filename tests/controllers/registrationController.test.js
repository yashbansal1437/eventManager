const request = require("supertest");
const app = require("../../src/app");
const Event = require("../../src/models/eventModel");
const User = require("../../src/models/userModel");
const { getUserToken } = require("../helpers/auth");

let userToken;
let userId;
let eventId;

beforeAll(async () => {
  const user = await User.create({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  });

  userId = user._id;
  userToken = await getUserToken(user);

  const event = await Event.create({
    title: "Test Event",
    startDateTime: new Date(Date.now() + 3600000),
    endDateTime: new Date(Date.now() + 7200000),
    capacity: 1,
    createdBy: userId,
  });

  eventId = event.event_id;
});

describe("Registration Controller", () => {
  it("registers user successfully", async () => {
    const res = await request(app)
      .post(`/api/events/${eventId}/register`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.event_id).toBe(eventId);
  });

  it("fails on duplicate registration", async () => {
    const res = await request(app)
      .post(`/api/events/${eventId}/register`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(400);
  });

  it("fails registration when event is full", async () => {
    const otherUser = await User.create({
      name: "Other",
      email: "other@example.com",
      password: "password123",
    });

    const otherToken = await getUserToken(otherUser);

    const res = await request(app)
      .post(`/api/events/${eventId}/register`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.statusCode).toBe(400);
  });

  it("deregisters user successfully", async () => {
    const res = await request(app)
      .delete(`/api/events/${eventId}/register`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.event_id).toBe(eventId);
  });

  it("fails deregistration if not registered", async () => {
    const res = await request(app)
      .delete(`/api/events/${eventId}/register`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(400);
  });
});
