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

// Handle error

module.exports = app;
