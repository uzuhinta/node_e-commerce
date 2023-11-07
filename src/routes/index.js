const express = require('express');
const router = express.Router();

const { permission, apiKey } = require('#src/auth/checkAuth.js');

router.use(apiKey);
router.use(permission('0000'));

router.use('/v1/api', require('./access'));

module.exports = router;
