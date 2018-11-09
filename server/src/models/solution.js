const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  problem: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Problem',
    required: true
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  submitDate: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  language: {
    type: String,
    required: true,
    default: 'C++'
  },
  code: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Solution', solutionSchema);
