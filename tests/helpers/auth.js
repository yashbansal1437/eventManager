const User = require("../../src/models/userModel");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const getAdminToken = async () => {
  const admin = await User.create({
    name: "Admin",
    email: "admin@test.com",
    password: "password123",
    role: "admin",
  });

  return jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET
  );
};

const getUserToken = async () => {
  const email = `user_${nanoid(6)}@test.com`;
  const user = await User.create({
    name: "User",
    email: email,
    password: "password123",
  });

  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );
};

module.exports = {
  getAdminToken,
  getUserToken,
};
