const {
  createService,
  createProject,
  getProject,
} = require("../Services/project.service");

exports.getProjects = async (req, res, next) => {
  try {
    const searchText = req.params.searchText;
    const page = req.params.page;
    const limit = req.params.limit;
    const projectId = req.params.projectId;

    console.log("fetching projects");

    const response = await getProject(
      limit,
      page,
      searchText,
      projectId,
      req?.user?._id
    );
    console.log("channel added", response);
    res.status(200).json({ ...response });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    console.log(error);
    return next(error);
  }
};

exports.postProject = async (req, res, next) => {
  try {
    console.log("PRoject", req.body);
    console.log("USER....", req.user);

    const projectName = req.body.projectName;
    const githubLink = req.body.githubLink;
    console.log("channel addeding");

    try {
      const serviceResponse = await createService(projectName, githubLink);
    } catch (error) {
      const projectResponse = await createProject(
        { projectName, githubLink },
        req.user,
        "Failed"
      );
    }
    const projectResponse = await createProject(
      { projectName, githubLink },
      req.user,
      "Deployed"
    );
    console.log("channel added", serviceResponse);
    res.status(200).json({ msg: "ok", project: { ...projectResponse } });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    console.log(error);
    return next(error);
  }
};

exports.getProjectAnalytics = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;

    console.log("fetching project analytics");

    const response = await getProject(limit, page, searchText, req?.user?._id);
    console.log("channel added", response);
    res.status(200).json({ ...response });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    console.log(error);
    return next(error);
  }
};
