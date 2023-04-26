const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    required: false,
  },
  githubLink: {
    type: String,
    required: true,
  },
  serviceId: {
    type: String,
  },
  containerId: {
    type: String,
  },
  port: {
    type: Number,
    required: true,
  },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
