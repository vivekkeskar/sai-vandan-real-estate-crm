const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let dbUrl = process.env.MONGODB_URI;

    if (!dbUrl) {
      console.log('No MONGODB_URI provided. Starting in-memory MongoDB Server for instant demo...');
      mongoServer = await MongoMemoryServer.create({
        binary: {
          version: process.env.MONGOMS_VERSION || '7.0.3'
        }
      });
      dbUrl = mongoServer.getUri();
    }

    const conn = await mongoose.connect(dbUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
