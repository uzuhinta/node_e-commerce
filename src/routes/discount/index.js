const express = require('express');
const router = express.Router();

const asyncHandler = require('#src/helpers/asyncHandler.js');
const { authentication } = require('#src/auth/checkAuth.js');
const discountController = require('#src/controllers/discount.controller.js');

router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.post('/cancel', asyncHandler(discountController.cancelDiscount));
router.get('/list_product_code', asyncHandler(discountController.getAllProductsUseDiscount));

router.use(authentication);

router.get('/', asyncHandler(discountController.getAllDiscount));
router.post('/', asyncHandler(discountController.createDiscount));
router.patch('/:discount_id', asyncHandler(discountController.updateDiscount));
router.delete('/:discount_id', asyncHandler(discountController.deleteDiscount));

module.exports = router;
