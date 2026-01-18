const express = require("express");
const responseHandler = require("./middleware/responseHandler");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const apiLimiter = require("./middleware/rateLimiter");

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use("/api", apiLimiter);

app.use(responseHandler);

app.get("/", (req, res) => {
  logger.debug("Health check endpoint hit");
  res.ok({ message: "Event Manager API is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

app.use(errorHandler);

module.exports = app;
