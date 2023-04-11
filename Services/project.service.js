const { spawn } = require("child_process");
const Project = require("../model/project");

const waitForProcessExit = (dockerBuildRun) => {
  return new Promise((resolve, reject) => {
    dockerBuildRun.on("exit", (exitCode) => {
      if (parseInt(exitCode) !== 0) {
        //Handle non-zero exit
        reject(new Error("Something went wrong!"));
      }
      resolve();
    });
  });
};

const processOutputAndErr = (process) => {
  process.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  process.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });
};

exports.createService = async (projectName, githubLink) => {
  console.log(projectName, githubLink);

  const dockerBuildRun = spawn("docker", [
    "build",
    "-t",
    `amanpatidar110/${projectName}`,
    githubLink,
  ]);

  processOutputAndErr(dockerBuildRun);
  await waitForProcessExit(dockerBuildRun);

  const dockerPushProcess = spawn("docker", [
    "push",
    `amanpatidar110/${projectName}`,
  ]);
  processOutputAndErr(dockerPushProcess);
  await waitForProcessExit(dockerPushProcess);

  const dockerRun = spawn("docker", [
    "service",
    "create",
    "--name",
    projectName,
    "--network",
    "my_network",
    "-p",
    ":3000",
    "--mode",
    "global",
    `amanpatidar110/${projectName}`,
  ]);
  processOutputAndErr(dockerRun);
  await waitForProcessExit(dockerRun);

  // dockerRun.on("close", (code) => {
  //   console.log(`child process exited with code ${code}`);
  // });
};

exports.createProject = async (projectData, user, status) => {
  const newProject = new Project({
    projectName: projectData?.projectName,
    githubLink: projectData?.githubLink,
    userId: user?._id,
    status,
  });

  const project = await newProject.save();
  return project;
};

exports.getProject = async (limit, page, searchText, projectId, userId) => {
  console.log("limit", limit, page, searchText, projectId, typeof userId);
  if (projectId) {
    const project = await Project.findOne({ _id: projectId, userId: userId });
    return { msg: "ok", project: { ...project } };
  } else {
    const projects = await Project.find({
      userId: userId,
      projectName: searchText
        ? { $regex: searchText || "", $options: "i" }
        : { $exists: true },
    })
      .skip((limit || 10) * (page || 0))
      .limit(limit || 10);
    return { msg: "ok", projects: [...projects] };
  }
};
