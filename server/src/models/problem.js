const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: Number,
    validator: (number) => {
      return Number.isInteger(number) && number >= 1 && number <= 5;
    },
    message: '{VALUE} is not an integer value'
  },
  task: {
    type: String,
    required: true,
    trim: true
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
    }
  }]
});

problemSchema
  .path('examples')
  .validate(examples => examples.length != 0);

module.exports = mongoose.model('Problem', problemSchema);
