const os = require('os');

exports.getIPAddress = () => {
  const ifaces = os.networkInterfaces();

  for (const iface of Object.values(ifaces)) {
    for (const net of iface) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }

  return null;
};
