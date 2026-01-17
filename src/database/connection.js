const mongoose = require('mongoose');
const logger = require('../utils/logger');
require('dotenv').config();

const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/eventManager';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.debug('MongoDB connection error:', error);
    }
}
module.exports = connectDB;