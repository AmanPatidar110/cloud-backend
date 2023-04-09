const express = require("express");
const { createService } = require("../Controllers/project.controller");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const searchText = req.params.searchText;
    const page = req.params.page;
    const limit = req.params.limit;

    console.log("fetching projects");

    // const response = await getProjects(limit, page, searchText);
    // console.log("channel added", serviceResponse);
    // res.status(200).json({ msg: "ok", projects: [] });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    console.log(error);
    return next(error);
  }
});

router.post("/add_project", async (req, res, next) => {
  try {
    const projectName = req.body.projectName;
    const githubLink = req.body.githubLink;
    console.log("channel addeding");

    // const projectResponse = await createProject(projectName, githubLink);
    const serviceResponse = await createService(projectName, githubLink);
    console.log("channel added", serviceResponse);
    // res.status(200).json({ msg: "ok", resp });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    console.log(error);
    return next(error);
  }
});

module.exports = router;
