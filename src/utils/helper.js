const jwt = require("jsonwebtoken");

const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

function getTimestamp() {
  const now = new Date();
  return `[${now.toISOString().slice(0, 10)} ${now
    .toTimeString()
    .slice(0, 8)}]`;
}

const eventResponse = (event) => ({
  event_id: event.event_id,
  title: event.title,
  description: event.description,
  startDateTime: event.startDateTime.toISOString(),
  endDateTime: event.endDateTime.toISOString(),
  capacity: event.capacity,
});

const eventDetailResponse = (event) => ({
  ...eventResponse(event),
  participants: event.participants,
  createdBy: event.createdBy.name,
  createdByEmail: event.createdBy.email,
  createdAt: event.createdAt,
  updatedBy: event.modifiedBy?.email || null,
  updatedAt: event.updatedAt,
});


module.exports = {
  signToken,
  verifyToken,
  getTimestamp,
  eventResponse,
  eventDetailResponse,
};