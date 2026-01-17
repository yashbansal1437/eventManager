const verifyToken = require('../utils/helper').verifyToken;
const ApiError = require("../utils/error");
const User = require("../models/userModel");

const authHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authorization token missing");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Invalid authorization token");
    }

    // Verify token
    const decoded = verifyToken(token);

    // Fetch user
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid token"));
    }

    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token expired"));
    }

    next(error);
  }
};

module.exports = authHandler;
