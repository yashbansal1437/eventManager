const jwt = require("jsonwebtoken");
const {
  signToken,
  verifyToken,
  getTimestamp,
  eventResponse,
  eventDetailResponse,
} = require("../../src/utils/helper");

describe("helper utils", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "testsecret";
    process.env.JWT_EXPIRES_IN = "1h";
  });

  describe("JWT helpers", () => {
    it("signs and verifies token", () => {
      const payload = { id: "123", role: "user" };
      const token = signToken(payload);

      expect(typeof token).toBe("string");

      const decoded = verifyToken(token);
      expect(decoded.id).toBe("123");
      expect(decoded.role).toBe("user");
    });
  });

  describe("getTimestamp", () => {
    it("returns formatted timestamp string", () => {
      const ts = getTimestamp();

      expect(ts).toMatch(/^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]$/);
    });
  });

  describe("event response helpers", () => {
    const baseEvent = {
      event_id: "evt123",
      title: "Test Event",
      description: "desc",
      startDateTime: new Date("2026-01-01T10:00:00Z"),
      endDateTime: new Date("2026-01-01T11:00:00Z"),
      capacity: 50,
    };

    it("formats eventResponse", () => {
      const res = eventResponse(baseEvent);

      expect(res).toEqual({
        event_id: "evt123",
        title: "Test Event",
        description: "desc",
        startDateTime: "2026-01-01T10:00:00.000Z",
        endDateTime: "2026-01-01T11:00:00.000Z",
        capacity: 50,
      });
    });

    it("formats eventDetailResponse", () => {
      const detailedEvent = {
        ...baseEvent,
        participants: ["u1", "u2"],
        createdBy: { name: "Creator", email: "creator@test.com" },
        modifiedBy: { email: "editor@test.com" },
        createdAt: new Date("2026-01-01T09:00:00Z"),
        updatedAt: new Date("2026-01-01T09:30:00Z"),
      };

      const res = eventDetailResponse(detailedEvent);

      expect(res.createdBy).toBe("Creator");
      expect(res.createdByEmail).toBe("creator@test.com");
      expect(res.updatedBy).toBe("editor@test.com");
      expect(res.participants.length).toBe(2);
    });
  });
});
