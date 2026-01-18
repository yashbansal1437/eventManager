const request = require("supertest");
const app = require("../../src/app");
const Event = require("../../src/models/eventModel");
const { getAdminToken, getUserToken } = require("../helpers/auth");

let adminToken;
let userToken

beforeAll(async () => {
  adminToken = await getAdminToken();
  userToken = await getUserToken();
});

describe("Event Controller", () => {
  it("should create an event", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Test Event",
        description: "Test desc",
        start_date: new Date(Date.now() + 3600000),
        end_date: new Date(Date.now() + 7200000),
        capacity: 100,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.event_id).toBeDefined();
    expect(res.body.data.title).toBe("Test Event");
  });

  it("should get all events", async () => {
    const res = await request(app).get("/api/events")
    .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get event by id", async () => {
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

    const res = await request(app).get(`/api/events/${event.body.data.event_id}`)
    .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.event_id).toBe(event.body.data.event_id);
  });

  it("should return 404 for non-existent event", async () => {
    const res = await request(app).get("/api/events/invalid123")
    .set("Authorization", `Bearer ${adminToken}`) ;

    expect(res.statusCode).toBe(404);
  });

  it("updates event when admin", async () => {
  const createRes = await request(app)
    .post("/api/events")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      title: "Old Title",
      start_date: new Date(Date.now() + 3600000),
      end_date: new Date(Date.now() + 7200000),
    });

  const eventId = createRes.body.data.event_id;

  const res = await request(app)
    .put(`/api/events/${eventId}`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      title: "Updated Title",
      capacity: 200,
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.data.title).toBe("Updated Title");
  expect(res.body.data.capacity).toBe(200);
});

it("blocks update for non-owner non-admin", async () => {
  const createRes = await request(app)
    .post("/api/events")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      title: "Owner Event",
      start_date: new Date(Date.now() + 3600000),
      end_date: new Date(Date.now() + 7200000),
    });

  const eventId = createRes.body.data.event_id;

  const res = await request(app)
    .put(`/api/events/${eventId}`)
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      title: "Hack Attempt",
    });

  expect(res.statusCode).toBe(403);
});

});
