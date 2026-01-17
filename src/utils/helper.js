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

module.exports = {
  signToken,
  verifyToken,
  getTimestamp
};