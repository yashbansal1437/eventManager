const errorHandler = require("../../src/middleware/errorHandler");
const ApiError = require("../../src/utils/error");

describe("errorHandler middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("handles Mongo duplicate key error (code 11000)", () => {
    const err = {
      code: 11000,
      keyValue: { email: "test@test.com" },
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "email already exists",
    });
  });

  it("handles ApiError", () => {
    const err = new ApiError(403, "Forbidden");

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Forbidden",
    });
  });

  it("handles Mongoose ValidationError", () => {
    const err = {
      name: "ValidationError",
      errors: {
        title: { message: "Title is required" },
        capacity: { message: "Capacity must be positive" },
      },
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid input data",
      errors: {
        title: "Title is required",
        capacity: "Capacity must be positive",
      },
    });
  });

  it("handles unknown errors as 500", () => {
    const err = new Error("Something broke");

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
    });
  });
});
