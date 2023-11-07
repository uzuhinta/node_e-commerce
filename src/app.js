const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./configs/config');
const checkEnable = require('./helpers/check.enable');

const app = express();

// Init middleware
app.use(morgan('combined'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Init DB
if (checkEnable(config.mongo_database.enable)) {
  require('./configs/mongo.config');
}

// Init router
app.use('/', require('./routes'));

// fallback route
app.use((req, res, next) => {
  const error = new Error('Not found!');
  error.status = 404;
  return next(error);
});

// Handle error
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    code: statusCode,
    status: 'error',
    message: error.message || 'Internal error!',
  });
});

module.exports = app;
