const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  fileSize:{
    type: Number,
    required: false
  }

});

const File = mongoose.model('File', fileSchema);

module.exports = File;


  