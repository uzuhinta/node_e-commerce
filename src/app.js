const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const config = require('./configs/config');
const checkEnable = require('./helpers/check.enable');
const { NotFoundError } = require('./core/error.response');
const globalErrorHandler = require('./helpers/globalErrorHandler');
const redisConfig = require('./configs/redis.config');
const morganMiddleware = require('./middlewares/morgan.middleware');
const logger = require('./loggers/winston.log');
const corelationId = require('./middlewares/corelationId.middleware');

const app = express();

// Init middleware
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credential: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(morganMiddleware);
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corelationId);

// Init DB
if (checkEnable(config.mongo_database.enable)) {
  require('./configs/mongo.config');
}

if (checkEnable(config.redis.enable)) {
  redisConfig.init(config.redis);
}

//
app.get('/api/status', (req, res) => {
  logger.info('Checking the API status: Everything is OK');
  res.status(200).send({
    status: 'UP',
    message: 'The API is up and running!',
  });
});

// Init router
app.use('/', require('./routes'));

// fallback route
app.use((req, res, next) => {
  next(new NotFoundError());
});

// Handle error
// eslint-disable-next-line no-unused-vars
app.use(globalErrorHandler);

module.exports = app;
