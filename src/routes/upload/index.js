const express = require('express');
const router = express.Router();

const asyncHandler = require('#src/helpers/asyncHandler.js');
const { authentication } = require('#src/auth/checkAuth.js');
const uploadController = require('#src/controllers/upload.controller.js');
const { uploadDisk } = require('#src/configs/multer.config.js');

router.use(authentication);

router.post('', asyncHandler(uploadController.uploadByUrl));
router.post('/thumb', uploadDisk.single('avatar'), asyncHandler(uploadController.uploadFileThumb));

module.exports = router;
