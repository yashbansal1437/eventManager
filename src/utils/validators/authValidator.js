const ApiError = require("../error");
const logger = require("../logger");

const validateAuthPayload = (payload, requiredFields = []) => {
  const missingFields = {};

  for (const field of requiredFields) {
    if (!payload[field]) {
      missingFields[field] = true;
    }
  }

  if (Object.keys(missingFields).length > 0) {
    logger.debug(
      `Missing fields in auth payload: ${JSON.stringify(missingFields)}`
    );
    throw new ApiError(400, "All fields are required");
  }

  // Normalize email if present
  if (payload.email) {
    payload.email = payload.email.trim().toLowerCase();
  }

  return payload;
};

module.exports = {
  validateAuthPayload,
};
