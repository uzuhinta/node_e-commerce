const express = require('express');
const router = express.Router();

const AccessController = require('#src/controllers/access.controller.js');

router.post('/sign-up', AccessController.signup);

module.exports = router;
