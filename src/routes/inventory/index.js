const express = require('express');
const router = express.Router();

const asyncHandler = require('#src/helpers/asyncHandler.js');
const inventoryController = require('#src/controllers/inventory.controller.js');
const { authentication } = require('#src/auth/checkAuth.js');

router.use(authentication);

router.get('/', asyncHandler(inventoryController.addStock));

module.exports = router;
