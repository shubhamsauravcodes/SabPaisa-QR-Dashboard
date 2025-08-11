const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB already connected');
      return mongoose.connection;
    }

    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sabpaisa-qr-dashboard';
    
    const options = {
      maxPoolSize: 5, // Reduced for serverless
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: true, // Enable mongoose buffering for serverless
      bufferMaxEntries: 0, // Disable mongoose buffering queue
    };

    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    return conn;
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    throw error; // Don't exit process in serverless environment
  }
};

module.exports = connectDB;
