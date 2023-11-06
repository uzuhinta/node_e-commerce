const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const _SECOND = 5000;

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCpu = os.cpus.length;
    const memoryUsage = process.memoryUsage().rss;

    console.log('MongoDB::: active connection ', numConnection);
    console.log(`Memory usage : ${memoryUsage / 1024 / 1024} MB`);

    // If each cpu can handle maximum 5 connection
    if (numConnection > numCpu * 5) {
      console.log('MongoDB::: detect overload');
      // send notify
    }
  }, _SECOND);
};

module.exports = checkOverload;
