function calculateNetworkStats(containerStats) {
  const networkStats = containerStats.networks;
  const uptime = containerStats.read.substring(0, 19);
  const upSeconds = (Date.now() - new Date(uptime).getTime()) / 1000;

  const stats = [];

  Object.entries(networkStats).forEach(([iface, values]) => {
    const receivedMB = values.rx_bytes / 1024 / 1024;
    const transmittedMB = values.tx_bytes / 1024 / 1024;
    const totalMB = receivedMB + transmittedMB;
    const errors = values.rx_errors + values.tx_errors;
    const dropped = values.rx_dropped + values.tx_dropped;
    const throughput = totalMB / upSeconds;
    const estimatedUsage = (upSeconds / 3600) * throughput;

    stats.push({
      networkName: iface,
      receivedMB: receivedMB.toFixed(2),
      transmittedMB: transmittedMB.toFixed(2),
      totalMB: totalMB.toFixed(2),
      errors,
      dropped,
      throughput: throughput.toFixed(2),
      estimatedUsage: estimatedUsage.toFixed(2),
    });
  });

  return stats;
}
module.exports = { calculateNetworkStats };
