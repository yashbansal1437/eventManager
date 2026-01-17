require("dotenv").config();

const app = require("./app");
const connectDB = require("./database/connection");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
