const {
  createProject,
  createDockerService,
  fetchProjects,
  updateProject,
} = require('../Services/project.service');

const { getIPAddress } = require('../Services/ip.service');
const { MessageTransport } = require('../Services/messageTransport.service');
const Project = require('../model/project');

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
  const projectName = req.body.projectName;
  const githubLink = req.body.githubLink;
  const projectType = req.body.projectType;
  const replicas = req.body.replicas;

  const messageTransport = new MessageTransport({
    email: req?.user?.email,
    projectName,
  });

  try {
    console.log('PRoject', req.body);
    console.log('USER....', req.user);
    messageTransport.log('Creating server');

    let projectResponse;
    try {
      projectResponse = await createProject(
        { projectName, githubLink, replicas, projectType },
        req.user,
        'Deploying'
      );
      res.status(200).json({
        msg: 'ok',
        project: { ...projectResponse, ip: getIPAddress() },
      });
    } catch (error) {
      messageTransport.log(error);
      throw error;
    }

    try {
      const { serviceId, containers, port } = await createDockerService(
        projectName,
        githubLink,
        replicas,
        projectType,
        messageTransport
      );

      const updateResponse = await updateProject(
        { _id: projectResponse._id },
        { port: port, serviceId: serviceId, status: 'Deployed' }
      );
      messageTransport.log('Project Deployed Successfully', updateResponse);
    } catch (error) {
      messageTransport.log('error', error);
      const updateResponse = await updateProject(
        { projectName, githubLink },
        req.user,
        'Failed'
      );
    }
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    messageTransport.log(error);
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
