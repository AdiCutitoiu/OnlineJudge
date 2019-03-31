const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  task: {
    type: String,
    required: true,
    trim: true
  },
  timeLimit: {
    type: Number,
    required: true,
    default: 2,
    validate : {
      validator: (number) => {
        return Number.isInteger(number) && number > 0 && number <= 3;
      },
      message: '{VALUE} is not an integer value'
    }
  },
  inputDesc: {
    type: String,
    required: true,
    trim: true  
  },
  outputDesc: {
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
    }
  }],
  tests: [{
    input: { 
      type: String,
      trim: true,
      required: true,
      select: false
    },
    output: { 
      type: String,
      trim: true,
      required: true,
      select: false
    }
  }]
});

problemSchema
  .path('examples')
  .validate(examples => examples.length != 0);

module.exports = mongoose.model('Problem', problemSchema);
