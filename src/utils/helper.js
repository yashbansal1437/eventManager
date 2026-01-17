

function getTimestamp() {
  const now = new Date();
  return `[${now.toISOString().slice(0, 10)} ${now
    .toTimeString()
    .slice(0, 8)}]`;
}

module.exports = {
  getTimestamp
};