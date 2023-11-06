const mongoose = require('mongoose');

const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log('MongoDB::: number of connection = ', numConnection);
};

module.exports = countConnect;
