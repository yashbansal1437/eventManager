const mongoose = require("mongoose");
const User = require("../../src/models/userModel");
const bcrypt = require("bcrypt");

describe("User Model", () => {
  it("creates user and hashes password", async () => {
    const user = await User.create({
      name: "Test User",
      email: "test@user.com",
      password: "password123",
    });

    const dbUser = await User.findOne({ email: "test@user.com" }).select("+password");
    expect(await bcrypt.compare("password123", dbUser.password)).toBe(true);
  });

  it("fails on invalid email", async () => {
    await expect(
      User.create({
        name: "Bad Email",
        email: "bad..email@test",
        password: "password123",
      })
    ).rejects.toThrow("Email not valid");
  });

  it("sets default role to user", async () => {
    const user = await User.create({
      name: "Role User",
      email: "role@user.com",
      password: "password123",
    });

    expect(user.role).toBe("user");
  });

  it("comparePassword returns true for correct password", async () => {
    const user = await User.create({
      name: "Compare",
      email: "compare@test.com",
      password: "password123",
    });

    const dbUser = await User.findOne({ email: "compare@test.com" }).select("+password");
    expect(await dbUser.comparePassword("password123")).toBe(true);
  });

  it("comparePassword returns false for wrong password", async () => {
    const user = await User.create({
      name: "CompareFail",
      email: "comparefail@test.com",
      password: "password123",
    });

    const dbUser = await User.findOne({ email: "comparefail@test.com" }).select("+password");
    expect(await dbUser.comparePassword("wrongpass")).toBe(false);
  });
});
