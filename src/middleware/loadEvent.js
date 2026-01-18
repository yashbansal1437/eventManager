const Event = require("../models/eventModel");
const ApiError = require("../utils/error");
const logger = require("../utils/logger");

const loadEvent = async (req, res, next) => {
  const event = await Event.findOne({ event_id: req.params.id });

  if (!event) {
    logger.error(`Event not found: ${req.params.id}`);
    throw new ApiError(404, "Event not found");
  }

  req.event = event;
  next();
};

module.exports = loadEvent;
