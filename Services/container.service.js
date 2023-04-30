const { dockerCommand } = require('docker-cli-js');
const { docker } = require('./docker.service');
const { calculateNetworkStats } = require('./helper');

const options = {
  machineName: null, // uses local docker
  currentWorkingDirectory: null, // uses current working directory
  echo: true, // echo command output to stdout/stderr
};

const getServiceContainers = async (serviceName) => {
  try {
    const data = await dockerCommand(`service ps ${serviceName}`, options);
    const taskIds = data.containerList.map((container) => container.id);
    console.log(taskIds);

    const containers = [];

    for (const taskId of taskIds) {
      const task = await docker.getTask(taskId);
      const container = await task.inspect();
      const containerStats = await getContainerStats(
        container?.Status?.ContainerStatus?.ContainerID
      );
      containers.push({ ...container, containerStats });
    }

    console.log(containers);

    return containers.map((container) => {
      return {
        containerId: container?.Status?.ContainerStatus?.ContainerID,
        status: container?.Status?.State,
        createdAt: container?.CreatedAt,
        updatedAt: container?.UpdatedAt,
        nodeId: container.NodeID,
        stats: container.containerStats,
      };
    });
  } catch (error) {
    console.log(error);
    throw new Error('Service is being updated. Please try again later.');
  }
};

const getContainerStats = async (containerId) => {
  try {
    const container = docker.getContainer(containerId);

    // Get the stats stream
    const stats = await container.stats({
      stream: false,
    });

    console.log(stats);

    const cpuDelta =
      stats.cpu_stats.cpu_usage.total_usage -
      stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta =
      stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
    const cpuUsage = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus;
    const cpuUsagePercent = cpuUsage * 100;

    const memUsage = stats.memory_stats.usage;
    const memLimit = stats.memory_stats.limit;
    const memUsagePercent = ((memUsage / memLimit) * 100).toFixed(2);

    const memUsageGB = (stats.memory_stats.usage / 1e9).toFixed(2);
    const memLimitGB = (stats.memory_stats.limit / 1e9).toFixed(2);

    const networkStats = calculateNetworkStats(stats);

    return {
      cpuUsagePercent,
      memUsagePercent,
      memUsageRatio: `${memUsageGB} GiB / ${memLimitGB} GiB`,
      networkStats,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { getServiceContainers, getContainerStats };
