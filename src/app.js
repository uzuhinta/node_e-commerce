const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');

const app = express();

// Init middleware
app.use(morgan('combined'));
app.use(helmet());
app.use(compression());

// Init DB

// Init router
app.get('/', (req, res) =>
  res.json({
    status: 200,
    message: 'Hello world!',
  })
);

// Handle error

module.exports = app;
