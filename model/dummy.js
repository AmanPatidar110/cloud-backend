const mongoose = require('mongoose');

const dummySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  }
});

const Dummy = mongoose.model('Dummy', dummySchema);

module.exports = Dummy;


  