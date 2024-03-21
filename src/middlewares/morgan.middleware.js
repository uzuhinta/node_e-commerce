const logger = require('#src/loggers/winston.log.js');
const morgan = require('morgan');

const stream = {
  write: (message) => logger.http(message),
};
const morganMiddleware = morgan(
  // ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  { stream }
);

module.exports = morganMiddleware;
