const express = require('express');
const router = express.Router();

const asyncHandler = require('#src/helpers/asyncHandler.js');
const { authentication } = require('#src/auth/checkAuth.js');
const productController = require('#src/controllers/product.controller.js');

router.get('/search/:keySearch', asyncHandler(productController.searchProduct));
router.get('/', asyncHandler(productController.findAllProduct));
router.get('/:product_id', asyncHandler(productController.getOneProduct));

router.use(authentication);

router.post('/', asyncHandler(productController.createProduct));
router.patch('/:product_id', asyncHandler(productController.updateProduct));
router.get('/draft', asyncHandler(productController.getAllDraftsForShop));
router.get('/publish', asyncHandler(productController.getAllPublishForShop));
router.post('/publish/:product_id', asyncHandler(productController.publishProductByShop));
router.post('/draft/:product_id', asyncHandler(productController.draftProductByShop));

module.exports = router;
