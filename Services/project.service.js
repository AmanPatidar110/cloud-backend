const { spawn } = require("child_process");

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
