const Event = require("../models/eventModel");
const ApiError = require("../utils/error");
const logger = require("../utils/logger");

/**
 * Register user for an event
 * POST /events/:id/register
 */
const registerForEvent = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  const result = await Event.updateOne(
    {
      event_id: eventId,
      startDateTime: { $gt: new Date() },
      participants: { $ne: userId },
      $expr: { $lt: [{ $size: "$participants" }, "$capacity"] },
    },
    {
      $addToSet: { participants: userId },
    }
  );

  if (result.modifiedCount === 0) {
    throw new ApiError(
      400,
      "Registration failed (event full, started, or already registered)"
    );
  }

  logger.info(`User ${userId} registered for event ${eventId}`);

  res.ok({ message: "Successfully registered for event",
    data: { 
        event_id: eventId
     } });
};

/**
 * Deregister user from an event
 * DELETE /events/:id/register
 */
const deregisterFromEvent = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  const result = await Event.updateOne(
    {
      event_id: eventId,
      startDateTime: { $gt: new Date() },
      participants: userId,
    },
    {
      $pull: { participants: userId },
    }
  );

  if (result.modifiedCount === 0) {
    throw new ApiError(
      400,
      "Deregistration failed (not registered or event already started)"
    );
  }

  logger.info(`User ${userId} deregistered from event ${eventId}`);

  res.ok({ message: "Successfully deregistered from event",
    data: { 
        event_id: eventId
     } 
    });
};

module.exports = {
  registerForEvent,
  deregisterFromEvent,
};
