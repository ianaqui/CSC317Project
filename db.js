/**
 *
 * @author - Adrian Aquino
 * @file db.js - MongoDB connection configuration
 *
 * 04/23/25 - Initial implementation
 * 04/25/25 - Added error handling
 *
 */

const mongoose = require('mongoose');

/**
 *
 * connectDB
 *
 * Function to connect to MongoDB
 *
 * @return   Promise resolving to mongoose connection
 */
const connectDB = async () => {
    try {
        // The syntax in your current code has errors - this is the correct format
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;