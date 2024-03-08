const express = require('express');
const router = express.Router();

const asyncHandler = require('#src/helpers/asyncHandler.js');
const notificationController = require('#src/controllers/notification.controller.js');
const { authentication } = require('#src/auth/checkAuth.js');

router.use(authentication);

router.get('', asyncHandler(notificationController.listNotificationByUser));

module.exports = router;
