const Event = require("../models/eventModel");
const ApiError = require("../utils/error");
const logger = require("../utils/logger");
const { validateAuthPayload } = require("../utils/validators/authValidator");
const {eventResponse, eventDetailResponse} = require("../utils/helper");

// Create a new event (admin only)
const createEvent = async (req, res) => {
  const { 
    title, description, start_date, end_date, capacity
} = validateAuthPayload(req.body, ["title","start_date","end_date"]);

  const event = await Event.create({
    title,
    description,
    startDateTime: start_date,
    endDateTime: end_date,
    capacity,
    createdBy: req.user.id,
  });

  logger.info(`Event created: ${event.event_id} by ${req.user.email}`);

  res.created({ message: "Event created successfully", data: eventResponse(event) });
};

// Get all events
const getEvents = async (req, res) => {
  const events = await Event.find()
    .sort({ startDateTime: 1 })
    .select("event_id title description startDateTime endDateTime capacity");

  res.ok({ data: events.map(eventResponse) });
};

// Get single event by ID
const getEventById = async (req, res) => {
  const event = await Event.findOne({ event_id: req.params.id }).populate("createdBy", "name email");

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  res.ok({ data: eventDetailResponse(event) });
};

// Update event (admin or owner)
const updateEvent = async (req, res) => {
  const event = req.event;

  const allowedFields = ["title","description","startDateTime","endDateTime","capacity"];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      event[field] = req.body[field];
    }
  });

  event.modifiedBy = req.user.id;
  await event.save();

  logger.info(`Event updated: ${event.event_id}`);

  res.ok({
    message: "Event updated successfully",
    data: eventResponse(event),
  });
};

// Delete event (admin or owner)
const deleteEvent = async (req, res) => {
  await req.event.deleteOne();

  logger.warn(`Event deleted: ${req.event.event_id}`);

  res.noContent();
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
