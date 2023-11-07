const express = require('express');
const router = express.Router();

const AccessController = require('#src/controllers/access.controller.js');
const asyncHandler = require('#src/helpers/asyncHandler.js');
const { authorization } = require('#src/auth/checkAuth.js');

router.post('/sign-up', asyncHandler(AccessController.signup));
router.post('/login', asyncHandler(AccessController.login));

router.use(authorization);

router.post('/logout', asyncHandler(AccessController.logout));

module.exports = router;
