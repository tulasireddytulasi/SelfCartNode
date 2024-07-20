const mongoose = require("mongoose");

/// Create User schema
const UserDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  version: { type: Number, required: true, default: 0 },
  userName: { type: String, required: true },
  salutation: { type: String },
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  email: { type: String },
  mobileNumber: { type: String },
  gender: { type: String },
  roles: { type: Array },
  organizations: { type: Array },
  locations: { type: Array },
  isDeleted: { type: Boolean },
  createdBy: { type: String, required: true },
  createdOn: { type: Date, default: Date.now, required: true },
  lastModifiedBy: { type: String },
  lastModifiedOn: { type: Date },
  profileName: { type: String },
  fullNameSearchable: { type: String },
  fullname: { type: String },
});

/// User model
const UserDetailsModel = mongoose.model("users", UserDetailsSchema);

module.exports = { UserDetailsModel };
