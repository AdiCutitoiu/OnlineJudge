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
  publishDate: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  timeLimit: {
    type: Number,
    required: true,
    validate : {
      validator: (number) => {
        return Number.isInteger(number) && number > 0 && number <= 3;
      },
      message: '{VALUE} is not an integer value'
    }
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
