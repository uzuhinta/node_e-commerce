const express = require('express');
const router = express.Router();

const asyncHandler = require('#src/helpers/asyncHandler.js');
const userController = require('#src/controllers/user.controller.js');

router.post('/new_user', asyncHandler(userController.newUser));

module.exports = router;
