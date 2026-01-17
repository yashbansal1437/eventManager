const getTimestamp = require("./helper").getTimestamp;

const levels = {
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
};

const LOG_LEVEL = (process.env.LOG_LEVEL || "INFO").toUpperCase();
if (!levels[LOG_LEVEL]) {
  throw new Error(`Invalid LOG_LEVEL: ${LOG_LEVEL}`);
}

const colors = {
  DEBUG: "\x1b[36m",
  INFO: "\x1b[32m",
  WARN: "\x1b[33m",
  ERROR: "\x1b[31m",
  RESET: "\x1b[0m",
};

function shouldLog(level) {
  return levels[level] >= levels[LOG_LEVEL];
}

function log(level, message) {
    if (!shouldLog(level)) return;
    const timestamp = getTimestamp();
  const color = colors[level] || "";
  const reset = colors.RESET;

  console.log(`${color}${timestamp} | ${level} | ${message}${reset}`);
}

function debug(message) {
  log("DEBUG", message);
}

function info(message) {
  log("INFO", message);
}

function warn(message) {
  log("WARN", message);
}

function error(message) {
  log("ERROR", message);
}

module.exports = {
  debug,
  info,
  warn,
  error
};
