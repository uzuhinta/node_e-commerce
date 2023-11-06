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

// start server
const app = require('./src/app');

const server = app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Exit Server');
  });

  // Notify send
});
