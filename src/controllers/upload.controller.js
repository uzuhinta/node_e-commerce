const { BadRequestError } = require('#src/core/error.response.js');
const { OkResponse } = require('#src/core/success.response.js');
const UploadService = require('#src/services/upload.service.js');

class UploadController {
  uploadByUrl = async (req, res) => {
    new OkResponse({
      message: 'Upload successfully',
      metadata: await UploadService.uploadImageFromUrl({ imgUrl: req.body.imgUrl, shopId: req.shop.shopId }),
    }).send(res);
  };

  uploadFileThumb = async (req, res) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError('File missing');
    }
    new OkResponse({
      message: 'Upload successfully',
      metadata: await UploadService.uploadImageFromLocal({ path: file.path, shopId: req.shop.shopId }),
    }).send(res);
  };
}

module.exports = new UploadController();
