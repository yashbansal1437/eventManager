const ApiError = require("../utils/error");

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  next();
};

const ownerOnly = (getOwnerId) => {
  return (req, res, next) => {
    const ownerId = getOwnerId(req);

    if (!ownerId) {
      throw new ApiError(403, "Resource ownership cannot be verified");
    }

    if (req.user.id !== ownerId) {
      throw new ApiError(403, "Access denied");
    }

    next();
  };
};

const adminOrOwner = (getOwnerId) => {
  return (req, res, next) => {
    const ownerId = getOwnerId(req);

    if (req.user.role === "admin") {
      return next();
    }

    if (!ownerId || req.user.id !== ownerId) {
      throw new ApiError(403, "Access denied");
    }

    next();
  };
};

module.exports = {
  adminOnly,
  ownerOnly,
  adminOrOwner,
};
