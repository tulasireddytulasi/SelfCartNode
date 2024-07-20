const mongoose = require("mongoose");

// Define Auth schema
const authSchema = new mongoose.Schema({
  token: {
    type: String,
  },
  userId: {
    type: String,
  },
  refreshToken: {
    type: String,
    required: false,
  },
  accessTokenExpiresIn: {
    type: String,
  },
  refreshTokenExpiresIn: {
    type: String,
  },
  otp: {
    type: String,
  },
  otpExpiresIn: {
    type: Number,
    required: true,
  },
  otpCounter: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now,
    required: true,
  },
  lastModifiedOn: {
    type: Date,
    default: Date.now,
    required: true,
  },
  mobileNumber: {
    type: String,
  },
  email: {
    type: String,
  },
  otpStatus: {
    type: Boolean,
    default: true,
  },
});

// Create Auth model
const AuthModel = mongoose.model("auth", authSchema);

module.exports = AuthModel;
