const cloudinary = require('#src/configs/cloudinary.config.js');

class UploadService {
  static uploadImageFromUrl = async ({ imgUrl, shopId }) => {
    const folderName = `product/${shopId}`;

    return cloudinary.uploader.upload(imgUrl, {
      folder: folderName,
    });
  };

  static uploadImageFromLocal = async ({ path, shopId }) => {
    const folderName = `product/${shopId}`;

    console.log(path);

    return cloudinary.uploader.upload(path, {
      folder: folderName,
    });
  };
}

module.exports = UploadService;
