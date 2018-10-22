const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }, 
  task: {
    type: String,
    required: true,
    trim: true
  },
  inputDescription: {
    type: String,
    required: true,
    trim: true  
  },
  outputDescription: {
    type: String,
    required: true,
    trim: true
  },
  examples: [{
    input: { 
      type: String,
      trim: true,
      required: true
    },
    output: { 
      type: String,
      trim: true,
      required: true
    },
    explanation: { 
      type: String,
      trim: true,
    },
  }]
});

problemSchema
  .path('examples')
  .validate(examples => examples.length != 0);

module.exports = mongoose.model('Problem', problemSchema);
