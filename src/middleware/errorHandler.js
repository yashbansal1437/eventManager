const ApiError = require("../utils/error");
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    logger.warn(`Duplicate key error on field: ${field}`);
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }

  if (err?.name === "ValidationError") {
    const fields = {};
    for (const key in err.errors) {
      fields[key] = err.errors[key].message;
    }

    return res.status(400).json({
      success: false,
      message: "Invalid input data",
      errors: fields,
    });
  }

  logger.error(err?.stack || err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

module.exports = errorHandler;
