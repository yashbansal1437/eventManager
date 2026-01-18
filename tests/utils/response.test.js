const ApiResponse = require("../../src/utils/response");

describe("ApiResponse", () => {
  it("creates response with defaults", () => {
    const res = new ApiResponse({});

    expect(res.success).toBe(true);
    expect(res.message).toBe("Success");
    expect(res.data).toBe(null);
  });

  it("creates response with custom values", () => {
    const res = new ApiResponse({
      statusCode: 201,
      message: "Created",
      data: { id: 1 },
    });

    expect(res.success).toBe(true);
    expect(res.message).toBe("Created");
    expect(res.data).toEqual({ id: 1 });
  });
});
