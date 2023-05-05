const { spawn } = require('child_process');
const Project = require('../model/project');

const simpleGit = require('simple-git');
const path = require('path');

const fs = require('fs');
const { docker } = require('./docker.service');

const auth = {
  username: '',
  password: '',
};
const encodedAuth = Buffer.from(JSON.stringify(auth)).toString('base64');

let GLOBAL_PORT = 4000;

const buildImage = async (repositoryUrl, repositoryPath, imageTag) => {
  try {
    const git = simpleGit();
    console.log('Cloning repository...');
    await git.clone(repositoryUrl, repositoryPath);

    // Build a Docker image from the cloned repository
    fs.copyFile(
      path.join(__dirname, '..', 'Dockerfiles', 'React', 'Dockerfile'),
      repositoryPath + '/Dockerfile',
      (err) => {
        if (err) {
          console.log(err);
          throw err;
        }
        console.log('File copied successfully.');
      }
    );
    console.log('Building image...');
    const imageStream = await docker.buildImage(
      {
        context: repositoryPath,
        src: ['Dockerfile'],
        t: imageTag,
        buildargs: { 3000: GLOBAL_PORT },
      },
      { pull: true }
    );

    console.log('Image built successfully');
    // Push the built image to Docker Hub
    await docker
      .getImage(imageTag)
      .push({ authconfig: { 'X-Registry-Auth': encodedAuth } });

    console.log('Image pushed successfully');
    // Clean up the temporary directory
    require('rimraf').sync(repositoryPath);
  } catch (error) {
    require('rimraf').sync(repositoryPath);
    console.log(error);
    throw error;
  }

  // res
  //   .status(200)
  //   .json({ message: `Image ${imageTag} built and pushed successfully.` });
};

exports.createDockerService = async (projectName, repositoryUrl) => {
  console.log('Createing service', projectName, repositoryUrl);

  const imageTag = `amanpatidar110/${projectName}:latest`;
  const repositoryPath = path.join(__dirname, 'tmp', Date.now().toString());

  try {
    // Clone the repository into a temporary directory
    await buildImage(repositoryUrl, repositoryPath, imageTag);

    const serviceSpec = {
      Name: projectName,
      TaskTemplate: {
        ContainerSpec: {
          Image: imageTag,
          Env: [`PORT=${GLOBAL_PORT}`],
          Args: ['-p', `GLOBAL_PORT:GLOBAL_PORT`],
        },
      },
      Mode: {
        Replicated: {
          Replicas: 2,
        },
      },
      Networks: [
        {
          Target: 'my_network',
        },
      ],
    };
    console.log('Creating service...');
    const service = await docker.createService(serviceSpec);
    // Get information about the container created by the service
    const tasks = await docker.listTasks({ service: service.id });
    console.log(
      'tasks',
      tasks.find((each) => each?.ServiceID === service?.id)
    );
    const taskId = tasks.find((each) => each?.ServiceID === service?.id).ID;
    const container = await docker.getContainer(taskId);
    const containerInfo = await container.inspect();

    GLOBAL_PORT += 1;
    console.log(service, 'service');
    console.log('container INFO', containerInfo);
    return { serviceId: service.id };
  } catch (error) {
    console.error(error);
    throw error;
  }

  // const dockerRun = spawn('docker', [
  //   'service',
  //   'create',
  //   '--name',
  //   projectName,
  //   '--network',
  //   'my_network',
  //   '-p',
  //   ':3000',
  //   '--mode',
  //   'global',
  //   `amanpatidar110/${projectName}`,
  // ]);
};

exports.createProject = async (projectData, user, status) => {
  const newProject = new Project({
    projectName: projectData?.projectName,
    githubLink: projectData?.githubLink,
    userId: user?._id,
    status,
    serviceId: projectData?.serviceId,
  });

  const project = await newProject.save();
  return project.toObject();
};

exports.fetchProjects = async (limit, page, searchText, projectId, userId) => {
  console.log('limit', limit, page, searchText, projectId, typeof userId);
  if (projectId) {
    const project = await Project.findOne({ _id: projectId, userId: userId });
    const tasks = await docker.listTasks({ service: project.projectName });
    console.log('tasks', tasks);

    const taskId = tasks[0].ID;
    const container = await docker.getContainer(taskId);
    const containerInfo = await container.inspect();

    return {
      msg: 'ok',
      project: { ...project.toObject() },
      tasks,
      containerInfo,
    };
  } else {
    const totalDocs = await Project.find({
      userId: userId,
      projectName: searchText
        ? { $regex: searchText || '', $options: 'i' }
        : { $exists: true },
    }).count();

    console.log(totalDocs, 'totalDocs');
    const projects = await Project.find({
      userId: userId,
      projectName: searchText
        ? { $regex: searchText || '', $options: 'i' }
        : { $exists: true },
    })
      .skip((limit || 10) * (page - 1 || 0))
      .limit(limit || 10);
    return { msg: 'ok', projects: [...projects], totalDocs };
  }
};
