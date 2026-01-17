const Event = require("../models/eventModel");
const ApiError = require("../utils/error");

const loadEvent = async (req, res, next) => {
  const event = await Event.findOne({ event_id: req.params.id });

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  req.event = event;
  next();
};

module.exports = loadEvent;
