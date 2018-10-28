const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  problem: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Problem',
  },
});

module.exports = mongoose.model('Test', testSchema);
