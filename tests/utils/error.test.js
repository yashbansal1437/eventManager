const ApiError = require("../../src/utils/error");

describe("ApiError", () => {
  it("creates ApiError with statusCode and message", () => {
    const err = new ApiError(404, "Not Found");

    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("ApiError");
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Not Found");
  });
});
