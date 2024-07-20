const mongoose = require("mongoose");

const userRelationshipSchema = new mongoose.Schema({
  version: { type: Number, required: true, default: 0 },
  userId: {
    type: String,
    required: true,
  },
  patientId: {
    type: String,
    required: true,
  },
  relationship: String,
  createdBy: String,
  createdOn: Date,
  lastModifiedBy: {
    type: String,
    required: true,
  },
  lastModifiedOn: {
    type: Date,
    required: true,
  },
});

const UserRelationshipModel = mongoose.model(
  "user-relationship",
  userRelationshipSchema
);

module.exports = UserRelationshipModel;
