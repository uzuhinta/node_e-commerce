const mongoose = require('mongoose');

const {
  server: { nodeEnv },
  mongo_database: { host, name, username, password },
} = require('./config');

const connectString = `mongodb+srv://${username}:${password}@${host}/${name}?retryWrites=true&w=majority`;

class MongoDatabase {
  constructor() {
    this.connect();
  }

  connect() {
    if (nodeEnv === 'dev') {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose
      .connect(connectString)
      .then(() => console.log(`MongoDB::: connected success ${nodeEnv === 'dev' && `host::${host} name ${name}`}`))
      .catch((err) => console.log('MongoDB::: connect error', err));
  }

  static getInstance() {
    if (!MongoDatabase.instance) {
      MongoDatabase.instance = new MongoDatabase();
    }

    return MongoDatabase.instance;
  }
}

const mongoDB = MongoDatabase.getInstance();

module.exports = mongoDB;
