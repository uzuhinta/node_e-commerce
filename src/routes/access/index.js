const express = require('express');
const router = express.Router();

const AccessController = require('#src/controllers/access.controller.js');
const asyncHandler = require('#src/helpers/asyncHandler.js');
const { authentication } = require('#src/auth/checkAuth.js');

router.post('/sign-up', asyncHandler(AccessController.signup));
router.post('/login', asyncHandler(AccessController.login));

router.use(authentication);

router.post('/logout', asyncHandler(AccessController.logout));
router.post('/handle-refresh-token', asyncHandler(AccessController.handleRefreshToken));

module.exports = router;
