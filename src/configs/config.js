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
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  redis: {
    enable: process.env.REDIS_ENABLE,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    connection_timeout: +process.env.REDIS_CONNECTION_TIMEOUT || 10000,
  },
};

module.exports = config;
