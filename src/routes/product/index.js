const express = require('express');
const router = express.Router();

const asyncHandler = require('#src/helpers/asyncHandler.js');
const { authentication } = require('#src/auth/checkAuth.js');
const productController = require('#src/controllers/product.controller.js');

router.use(authentication);

router.post('/', asyncHandler(productController.createProduct));

module.exports = router;
