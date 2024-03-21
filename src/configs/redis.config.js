const redis = require('redis');
const _ = require('lodash');
const {
  redis: { connection_timeout },
} = require('./config');
const { RedisConnectionError } = require('#src/core/error.response.js');
const logger = require('#src/loggers/winston.log.js');

const clients = {};
let connectionTimeout;

function throwTimeoutError() {
  connectionTimeout = setTimeout(() => {
    throw new RedisConnectionError();
  }, connection_timeout);
}

function instanceEventListeners({ conn }) {
  conn.on('connect', () => {
    logger.info('Redis - Connection status: connected');
    clearTimeout(connectionTimeout);
  });

  conn.on('end', () => {
    logger.info('Redis - Connection status: disconnected');
    throwTimeoutError();
  });

  conn.on('reconnecting', () => {
    logger.info('Redis - Connection status: reconnecting');
    clearTimeout(connectionTimeout);
  });

  conn.on('error', (err) => {
    logger.info('Redis - Connection status: error ', { err });
    throwTimeoutError();
  });
}

const init = ({ host, port, username, password }) => {
  const cacheInstance = redis.createClient({ host, port, username, password });
  clients.cacheInstance = cacheInstance;
  instanceEventListeners({ conn: cacheInstance });
};

const getClients = () => clients;

const closeConnections = () => _.forOwn(clients, (conn) => conn.quit());

module.exports = {
  init,
  getClients,
  closeConnections,
};
