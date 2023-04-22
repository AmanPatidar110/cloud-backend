const {
  createProject,
  createDockerService,
  fetchProjects,
} = require('../Services/project.service');

exports.getProjects = async (req, res, next) => {
  try {
    const searchText = req.query.searchText;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit || 10);
    const projectId = req.query.projectId;

    console.log('fetching projects', limit, page, searchText, projectId);

    const response = await fetchProjects(
      limit,
      page,
      searchText,
      projectId,
      req?.user?._id
    );
    // console.log('channel added', response);
    res.status(200).json({ ...response });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    console.log(error);
    return next(error);
  }
};

exports.postProject = async (req, res, next) => {
  try {
    console.log('PRoject', req.body);
    console.log('USER....', req.user);

    const projectName = req.body.projectName;
    const githubLink = req.body.githubLink;
    console.log('channel addeding');

    let newService;
    try {
      newService = await createDockerService(projectName, githubLink);
      const projectResponse = await createProject(
        { projectName, githubLink, serviceId: newService.id },
        req.user,
        'Deployed'
      );
      console.log('project added', projectResponse);
      console.log('service', newService);
      res.status(200).json({ msg: 'ok', project: { ...projectResponse } });
    } catch (error) {
      console.log('error', error);
      const projectResponse = await createProject(
        { projectName, githubLink },
        req.user,
        'Failed'
      );
      return res
        .status(200)
        .json({ msg: 'Failed', project: { ...projectResponse } });
    }
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    console.log(error);
    return next(error);
  }
};

exports.getProjectAnalytics = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;

    console.log('fetching project analytics');

    const response = await getProject(limit, page, searchText, req?.user?._id);
    console.log('channel added', response);
    res.status(200).json({ ...response });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    console.log(error);
    return next(error);
  }
};
