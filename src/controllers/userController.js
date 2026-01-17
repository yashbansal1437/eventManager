const User = require("../models/userModel");
const ApiError = require("../utils/error");
const logger = require("../utils/logger");
const signToken = require("../utils/helper").signToken;
const { validateAuthPayload } = require("../utils/validators/authValidator");


const registerUser = async (req, res) => {
  const { name, email, password } = validateAuthPayload(req.body, [
    "name",
    "email",
    "password",
  ]);

  const user = await User.create({name,email,password});

  logger.debug(`User registered:${user.email} - ${user.role}`);

  res.created({
    message: "User registered successfully",
    data: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
};

const registerAdmin = async (req, res) => {
  const { name, email, password, admin_secret } =
    validateAuthPayload(req.body, [
      "name",
      "email",
      "password",
      "admin_secret",
    ]);

  if (admin_secret !== process.env.ADMIN_SECRET) {
    logger.warn(`Invalid admin secret attempt for email: ${email}`);
    throw new ApiError(403, "Invalid admin secret");
  }

  const user = await User.create({name,email,password,role: "admin" });
  logger.debug(`Admin registered:${user.email} - ${user.role}`);
  
  res.created({
    message: "Admin registered successfully",
    data: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = validateAuthPayload(req.body, [
    "email",
    "password",
  ]);

  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    logger.warn(`Failed login attempt for email: ${email}`);
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signToken({id: user._id,role: user.role});

  logger.debug(`User logged in: ${user.email}`);
  
  res.ok({
    message: "Login successful",
    data: {
      email: user.email,
      role: user.role,
      token: token,
    },
  });
};

const getMe = async (req, res) => {
  res.ok({
    data: {
      email: req.user.email,
      role: req.user.role
    }
  });
};

module.exports = {
  registerUser,
  registerAdmin,
  loginUser,
  getMe,
};
