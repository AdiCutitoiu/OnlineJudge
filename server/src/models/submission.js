const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  problem: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Problem',
    required: true
  },
  submitter: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  submitDate: {
    type: Date,
    required: true,
  },
  language: {
    type: String,
    enum: ['C++', 'JavaScript'],
    required: true
  },
  code: {
    type: String,
    required: true
  },
  result: {
    type: String,
    enum: ['Compilation error', 'Fail', 'Pass'],
    required: true
  }
});

module.exports = mongoose.model('Submission', submissionSchema);
