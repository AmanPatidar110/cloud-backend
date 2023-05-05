const { spawn } = require('child_process');
const Project = require('../model/project');

const simpleGit = require('simple-git');
const path = require('path');
const tar = require('tar-fs');

const fs = require('fs');
const { docker } = require('./docker.service');

const auth = {
  username: '',
  password: '',
};
const { dockerCommand } = require('docker-cli-js');
const { getServiceContainers } = require('./container.service');
const { getIPAddress } = require('./ip.service');
const { MessageTransport } = require('./messageTransport.service');
const { response } = require('express');
const options = {
  machineName: null, // uses local docker
  currentWorkingDirectory: null, // uses current working directory
  echo: true, // echo command output to stdout/stderr
};

let GLOBAL_PORT = 4026;

const buildImage = async (
  repositoryUrl,
  repositoryPath,
  imageName,
  tag,
  messageTransport
) => {
  try {
    messageTransport.log('Building image... from:', repositoryPath);
    const tarStream = tar.pack(repositoryPath);

    return new Promise((resolve, reject) => {
      try {
        docker.buildImage(
          tarStream,
          { t: `${imageName}:${tag}`, buildargs: { PORT: '3000' } },

          (err, stream) => {
            if (err) {
              messageTransport.log(`Error: ${err}`);
              return;
            }
            stream.pipe(process.stdout);
            stream.on('error', (err) => {
              messageTransport.log(err);
              reject(err);
            });
            stream.on('end', () => {
              messageTransport.log('Image build complete!');
              require('rimraf').sync(repositoryPath);
              resolve();
            });
          }
        );
      } catch (err) {
        messageTransport.log(err);
        require('rimraf').sync(repositoryPath);

        reject(err);
      }
    });
  } catch (error) {
    messageTransport.log(error);
    require('rimraf').sync(repositoryPath);
    throw error;
  }
};

const pushImage = async (
  repositoryUrl,
  repositoryPath,
  imageName,
  tag,
  messageTransport
) => {
  try {
    messageTransport.log('Pushing Image');

    const builtImage = docker.getImage(`${imageName}:latest`);

    return new Promise((resolve, reject) => {
      builtImage.push({ authconfig: auth }, (err, stream) => {
        if (err) reject(err);

        // Handle the push output
        docker.modem.followProgress(stream, onFinished, onProgress);

        function onFinished(err, output) {
          if (err) reject(err);

          messageTransport.log('Image pushed successfully');
          messageTransport.log(output);
          resolve(output);
        }

        function onProgress(event) {
          messageTransport.log(event);
        }
      });
    });
  } catch (error) {
    messageTransport.log(error);
    throw error;
  }
};

const prepareRepo = async (
  repositoryUrl,
  repositoryPath,
  projectType,
  messageTransport
) => {
  try {
    messageTransport.log('Preparing Repo...');

    const git = simpleGit();
    messageTransport.log('Cloning repository...');
    await git.clone(repositoryUrl, repositoryPath);

    return new Promise((resolve, reject) => {
      // Build a Docker image from the cloned repository
      fs.copyFile(
        path.join(__dirname, '..', 'Dockerfiles', projectType, 'Dockerfile'),
        repositoryPath + '/Dockerfile',
        (err) => {
          if (err) {
            messageTransport.log(err);
            reject(err);
          }
          messageTransport.log('File copied successfully.');
          resolve();
        }
      );
    });
  } catch (error) {
    messageTransport.log(error);
    throw error;
  }
};

exports.createDockerService = async (
  projectName,
  repositoryUrl,
  replicas,
  projectType,
  maxRAM,
  maxStorage,
  messageTransport
) => {
  const imageName = `amanpatidar110/${projectName}`;
  const repositoryPath = path.join(__dirname, 'tmp', Date.now().toString());

  try {
    // Clone the repository into a temporary directory
    await prepareRepo(
      repositoryUrl,
      repositoryPath,
      projectType,
      messageTransport
    );
    await buildImage(
      repositoryUrl,
      repositoryPath,
      imageName,
      'latest',
      messageTransport
    );
    await pushImage(
      repositoryUrl,
      repositoryPath,
      imageName,
      'latest',
      messageTransport
    );

    const serviceSpec = {
      Name: projectName,
      TaskTemplate: {
        ContainerSpec: {
          Image: `${imageName}:latest`,
        },
      },
      Mode: {
        Replicated: {
          Replicas: replicas || 2,
        },
      },
      EndpointSpec: {
        Ports: [
          {
            Protocol: 'tcp',
            PublishedPort: GLOBAL_PORT,
            TargetPort: 3000,
          },
        ],
      },
      Resources: {
        Limits: {
          MemoryBytes: (maxRAM || 1) * 1024,
          StorageBytes: (maxStorage || 10) * 1024,
        },
      },
    };
    messageTransport.log('Creating service...');
    const service = await docker.createService(serviceSpec);
    messageTransport.log(`Service created with ID: ${service.id}`);
    messageTransport.log(
      `Your server can be accessed at: http://${getIPAddress()}:${GLOBAL_PORT}`
    );

    const response = { serviceId: service.id, port: GLOBAL_PORT };
    GLOBAL_PORT += 1;

    return response;
  } catch (error) {
    messageTransport.log(error);
    throw error;
  }
};

exports.createProject = async (projectData, user, status) => {
  const newProject = new Project({
    projectName: projectData?.projectName,
    githubLink: projectData?.githubLink,
    userId: user?._id,
    status,
    serviceId: projectData?.serviceId || '',
    port: projectData?.port || 0,
    replicas: projectData?.replicas || 0,
    projectType: projectData?.projectType || '',
    maxStorage: projectData?.maxStorage || 15,
    maxRAM: projectData?.maxRAM || 1,
  });

  const project = await newProject.save();
  return project.toObject();
};

exports.updateProject = async (query, projectData) => {
  const project = await Project.updateOne(query, projectData);
  return project;
};

exports.fetchProjects = async (limit, page, searchText, projectId, userId) => {
  console.log('limit', limit, page, searchText, projectId, typeof userId);

  let project;
  try {
    if (projectId) {
      project = await Project.findOne({ _id: projectId, userId: userId });
      const containers = await getServiceContainers(project.projectName);

      return {
        msg: 'ok',
        project: { ...project.toObject() },
        containers,
        ip: getIPAddress(),
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
      return {
        msg: 'ok',
        projects: [...projects],
        totalDocs,
        ip: getIPAddress(),
      };
    }
  } catch (error) {
    console.log(error);
    return {
      msg: error.message || 'Something went wrong',
      project,
      containers: [],
    };
  }
};

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
