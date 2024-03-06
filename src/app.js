const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./configs/config');
const checkEnable = require('./helpers/check.enable');
const { NotFoundError } = require('./core/error.response');
const globalErrorHandler = require('./helpers/globalErrorHandler');

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
  next(new NotFoundError());
});

// Handle error
// eslint-disable-next-line no-unused-vars
app.use(globalErrorHandler);

module.exports = app;
