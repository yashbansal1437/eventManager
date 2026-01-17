const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authHandler");
const loadEvent = require("../middleware/loadEvent");
const { adminOnly, adminOrOwner } = require("../middleware/rbac");

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const { registerForEvent, deregisterFromEvent } = require("../controllers/registrationController");


// Create event (admin only)
router.post("/", authMiddleware, adminOnly, createEvent);

// Get all events
router.get("/", authMiddleware, getEvents);

// Get single event by event_id
router.get("/:id",authMiddleware,getEventById);

// Update event (admin or owner)
router.put("/:id", authMiddleware,loadEvent,
    adminOrOwner((req) => req.event.createdBy.toString()),
    updateEvent
);

// Delete event (admin or owner)
router.delete("/:id",authMiddleware,loadEvent,
  adminOrOwner((req) => req.event.createdBy.toString()),
  deleteEvent
);


// Register for event
router.post("/:id/register", authMiddleware, registerForEvent);

// Deregister from event
router.delete("/:id/register", authMiddleware, deregisterFromEvent);

module.exports = router;
