const express = require('express');
const {
  getProjects,
  postProject,
} = require('../Controllers/project.controller');
const router = express.Router();

router.get('/', getProjects);
router.post('/add_project', postProject);

module.exports = router;
