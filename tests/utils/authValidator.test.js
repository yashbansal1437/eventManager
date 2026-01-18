const { validateAuthPayload } = require("../../src/utils/validators/authValidator");
const ApiError = require("../../src/utils/error");

describe("validateAuthPayload", () => {
  it("passes when all required fields are present", () => {
    const payload = {
      email: "TEST@Email.COM ",
      password: "secret",
    };

    const result = validateAuthPayload(payload, ["email", "password"]);

    expect(result.email).toBe("test@email.com"); // normalized
    expect(result.password).toBe("secret");
  });

  it("throws error when required fields are missing", () => {
    const payload = { email: "test@email.com" };

    expect(() =>
      validateAuthPayload(payload, ["email", "password"])
    ).toThrow(ApiError);
  });

  it("does not modify payload if email is not present", () => {
    const payload = { password: "secret" };

    const result = validateAuthPayload(payload, ["password"]);

    expect(result).toEqual({ password: "secret" });
  });
});
