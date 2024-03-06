const express = require('express');
const router = express.Router();

const asyncHandler = require('#src/helpers/asyncHandler.js');
const checkoutController = require('#src/controllers/checkout.controller.js');

router.post('/review', asyncHandler(checkoutController.checkoutReview));

module.exports = router;
