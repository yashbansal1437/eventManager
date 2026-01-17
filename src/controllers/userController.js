const User = require("../models/userModel");
const ApiError = require("../utils/error");
const logger = require("../utils/logger");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    missing_fields = {
      name: !name,
      email: !email,
      password: !password,
    };
    logger.debug("Missing fields in registration: " + JSON.stringify(missing_fields));
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  res.created({
    message: "User registered successfully",
    data: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  res.ok({
    message: "Login successful",
    data: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
};

const getMe = async (req, res) => {
  res.ok({
    data: req.user,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
