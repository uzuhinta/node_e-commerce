// config environment variable
require('dotenv').config(); // common variable
const nodeEnv = process.env.NODE_ENV;
// override by specific environment variable
require('dotenv').config({
  path: `.env.${nodeEnv}`,
  override: true,
});
const {
  server: { port },
} = require('./src/configs/config');

console.log(require('./src/configs/config'));

// start server
const app = require('./src/app');
const logger = require('#src/loggers/winston.log.js');

const server = app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});
