const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  problem: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Problem',
  },
  compilationMessage: {
    type: String
  },
  submitDate: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  testResults: [{
    test: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Test',
      required: true,
    },
    pass: {
      type: Boolean,
      required: true,
    }
  }],
});

module.exports = mongoose.model('Solution', solutionSchema);
