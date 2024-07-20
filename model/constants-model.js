const mongoose = require("mongoose");

var constantSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  value: {
    type: mongoose.Mixed,
    required: true,
  },
});

const ConstantsModel = mongoose.model("constants", constantSchema);

module.exports = ConstantsModel;
