const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  input: {
    type: String,
    trim: true,
    required: true,
  },
  output: {
    type: String,
    trim: true,
    required: true,
  },
});

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  task: {
    type: String,
    required: true,
    trim: true,
  },
  inputDesc: {
    type: String,
    required: true,
    trim: true,
  },
  outputDesc: {
    type: String,
    required: true,
    trim: true,
  },
  examples: [
    {
      input: {
        type: String,
        trim: true,
        required: true,
      },
      output: {
        type: String,
        trim: true,
        required: true,
      },
    },
  ],
  tests: [
    {
      type: testSchema,
    },
  ],
});

problemSchema.path("examples").validate((examples) => examples.length != 0);

module.exports = mongoose.model("Problem", problemSchema);
