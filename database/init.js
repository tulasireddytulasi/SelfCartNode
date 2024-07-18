const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017";
// process.env.MONGO_URI;

// mongodb://localhost:27017

function connectDB() {
  try {
    return mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    throw new Error(error);
  }
}
module.exports = connectDB;
