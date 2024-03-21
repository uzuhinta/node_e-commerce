const winston = require('winston');
require('winston-daily-rotate-file');
const { ecsFormat } = require('@elastic/ecs-winston-format');
const {
  server: { nodeEnv },
} = require('../configs/config');

const logger = winston.createLogger({
  level: nodeEnv !== 'production' ? 'debug' : 'info',
  format: ecsFormat({ convertReqRes: true }),
  defaultMeta: { service: 'backend-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (nodeEnv !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.json(),
    })
  );
}

module.exports = logger;
