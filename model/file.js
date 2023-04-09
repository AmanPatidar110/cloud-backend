const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  filesize:{
    type: Number,
    required: false
  }

});

const File = mongoose.model('File', fileSchema);

module.exports = File;


  