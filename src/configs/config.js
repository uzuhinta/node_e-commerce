const config = {
  server: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 8080,
  },
  mongo_database: {
    enable: process.env.MONGO_DATABASE_ENABLE,
    username: process.env.MONGO_DATABASE_USERNAME,
    password: process.env.MONGO_DATABASE_PASSWORD,
    host: process.env.MONGO_DATABASE_HOST,
    port: parseInt(process.env.MONGO_DATABASE_PORT, 10) || 27017,
    name: process.env.MONGO_DATABASE_NAME,
  },
  discord: {
    enable: process.env.DISCORD_ENABLE,
    token: process.env.DISCORD_TOKEN,
    chanelId: process.env.DISCORD_CHANEL_ID,
  },
};

module.exports = config;
