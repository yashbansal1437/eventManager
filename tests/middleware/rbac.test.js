const { adminOnly, ownerOnly, adminOrOwner } = require("../../src/middleware/rbac");
const ApiError = require("../../src/utils/error");

describe("RBAC Middleware", () => {
  const mockRes = {};
  const next = jest.fn();

  beforeEach(() => next.mockClear());

  describe("adminOnly", () => {
    it("allows admin", () => {
      const req = { user: { role: "admin" } };
      adminOnly(req, mockRes, next);
      expect(next).toHaveBeenCalled();
    });

    it("blocks non-admin", () => {
      const req = { user: { role: "user" } };
      expect(() => adminOnly(req, mockRes, next))
        .toThrow(ApiError);
    });
  });

  describe("ownerOnly", () => {
    const getOwnerId = () => "owner123";

    it("allows owner", () => {
      const req = { user: { id: "owner123" } };
      ownerOnly(getOwnerId)(req, mockRes, next);
      expect(next).toHaveBeenCalled();
    });

    it("fails when owner cannot be resolved", () => {
      const req = { user: { id: "x" } };
      expect(() => ownerOnly(() => null)(req, mockRes, next))
        .toThrow(ApiError);
    });

    it("blocks non-owner", () => {
      const req = { user: { id: "other" } };
      expect(() => ownerOnly(getOwnerId)(req, mockRes, next))
        .toThrow(ApiError);
    });
  });

  describe("adminOrOwner", () => {
    const getOwnerId = () => "owner123";

    it("allows admin", () => {
      const req = { user: { id: "x", role: "admin" } };
      adminOrOwner(getOwnerId)(req, mockRes, next);
      expect(next).toHaveBeenCalled();
    });

    it("allows owner", () => {
      const req = { user: { id: "owner123", role: "user" } };
      adminOrOwner(getOwnerId)(req, mockRes, next);
      expect(next).toHaveBeenCalled();
    });

    it("blocks non-owner non-admin", () => {
      const req = { user: { id: "nope", role: "user" } };
      expect(() => adminOrOwner(getOwnerId)(req, mockRes, next))
        .toThrow(ApiError);
    });
  });
});
