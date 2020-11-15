const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  problem: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Problem",
  },
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Test", testSchema);
