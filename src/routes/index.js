const express = require('express');
const router = express.Router();

const { permission, apiKey } = require('#src/auth/checkAuth.js');
const { pushToLogDiscord } = require('#src/middlewares/loger.middleware.js');

router.use(pushToLogDiscord);
router.use(apiKey);
router.use(permission('0000'));

router.use('/v1/api/products', require('./product'));
router.use('/v1/api/discounts', require('./discount'));
router.use('/v1/api/inventory', require('./inventory'));
router.use('/v1/api/cart', require('./cart'));
router.use('/v1/api/checkout', require('./checkout'));
router.use('/v1/api/comment', require('./comment'));
router.use('/v1/api/notification', require('./notification'));
router.use('/v1/api/upload', require('./upload'));
router.use('/v1/api/profile', require('./profile'));
router.use('/v1/api/rbac', require('./rbac'));
router.use('/v1/api', require('./access'));

module.exports = router;
