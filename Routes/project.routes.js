const express = require("express");
const { createService } = require("../Controllers/project.controller");
const router = express.Router();

router.post("/add_project", async (req, res, next) => {
  try {
    const projectName = req.body.projectName;
    const githubLink = req.body.githubLink;
    console.log("channel addeding");

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
