const express = require('express');
const router = express.Router();

const { permission, apiKey } = require('#src/auth/checkAuth.js');

router.use(apiKey);
router.use(permission('0000'));

router.use('/v1/api/products', require('./product'));
router.use('/v1/api/discounts', require('./discount'));
router.use('/v1/api/inventory', require('./inventory'));
router.use('/v1/api/cart', require('./cart'));
router.use('/v1/api/checkout', require('./checkout'));
router.use('/v1/api', require('./access'));

module.exports = router;
