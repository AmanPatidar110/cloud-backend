const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectname: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  status:{
    type: String,
    required: false
  },


});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;


  