const {
  server: { nodeEnv },
} = require('#src/configs/config.js');

const sendErrorDev = (err, req, res) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
  if (nodeEnv === 'development') {
    return sendErrorDev(err, req, res);
  }
  sendErrorProd(err, req, res);
};

module.exports = globalErrorHandler;
