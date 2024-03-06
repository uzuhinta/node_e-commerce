const express = require('express');
const router = express.Router();

const asyncHandler = require('#src/helpers/asyncHandler.js');
const cartController = require('#src/controllers/cart.controller.js');

router.get('/', asyncHandler(cartController.getCart));
router.post('/', asyncHandler(cartController.addToCart));
router.delete('/', asyncHandler(cartController.deleteFromCart));

module.exports = router;
