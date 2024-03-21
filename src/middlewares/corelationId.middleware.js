const { v4: uuidv4 } = require('uuid');
const HEADER = require('#src/constants/header.constant.js');
const logger = require('#src/loggers/winston.log.js');

const corelationId = (req, res, next) => {
  const requestId = req.headers[HEADER.REQUEST_ID];
  req.requestId = requestId ? requestId : uuidv4();

  logger.info('Input:::', req);

  next();
};

module.exports = corelationId;
