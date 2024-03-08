const cloudinary = require('cloudinary').v2;
const {
  cloudinary: { api_key, api_secret, cloud_name },
} = require('./config');

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

module.exports = cloudinary;
