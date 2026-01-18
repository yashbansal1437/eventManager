const mongoose = require("mongoose");
const Event = require("../../src/models/eventModel");

describe("Event Model", () => {
  let userId;

  beforeAll(() => {
    userId = new mongoose.Types.ObjectId();
  });

  it("creates event and auto-generates event_id", async () => {
    const event = await Event.create({
      title: "Test Event",
      startDateTime: new Date(Date.now() + 3600000),
      endDateTime: new Date(Date.now() + 7200000),
      createdBy: userId,
    });

    expect(event.event_id).toBeDefined();
    expect(event.event_id.length).toBe(10);
  });

  it("fails if startDateTime is in the past", async () => {
    await expect(
      Event.create({
        title: "Past Event",
        startDateTime: new Date(Date.now() - 10000),
        endDateTime: new Date(Date.now() + 10000),
        createdBy: userId,
      })
    ).rejects.toThrow("Event start time cannot be in the past");
  });

  it("fails if endDateTime is before startDateTime", async () => {
    await expect(
      Event.create({
        title: "Invalid Event",
        startDateTime: new Date(Date.now() + 20000),
        endDateTime: new Date(Date.now() + 10000),
        createdBy: userId,
      })
    ).rejects.toThrow("Event end time must be after start time");
  });

  it("checks if user is registered", async () => {
    const user = new mongoose.Types.ObjectId();

    const event = await Event.create({
      title: "Registration Check",
      startDateTime: new Date(Date.now() + 3600000),
      endDateTime: new Date(Date.now() + 7200000),
      createdBy: userId,
      participants: [user],
    });

    expect(event.isUserRegistered(user)).toBe(true);
    expect(event.isUserRegistered(new mongoose.Types.ObjectId())).toBe(false);
  });

  it("checks if event is full", async () => {
    const event = await Event.create({
      title: "Capacity Check",
      startDateTime: new Date(Date.now() + 3600000),
      endDateTime: new Date(Date.now() + 7200000),
      capacity: 1,
      createdBy: userId,
      participants: [new mongoose.Types.ObjectId()],
    });

    expect(event.isFull()).toBe(true);
  });

  it("calculates duration in HH:MM format", async () => {
    const event = await Event.create({
      title: "Duration Event",
      startDateTime: new Date("2027-01-01T10:00:00Z"),
      endDateTime: new Date("2027-01-01T12:30:00Z"),
      createdBy: userId,
    });

    expect(event.getDurationHHMM()).toBe("02:30");
  });
});
