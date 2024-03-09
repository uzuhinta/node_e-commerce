const express = require('express');
const router = express.Router();

const rbacController = require('#src/controllers/rbac.controller.js');
const asyncHandler = require('#src/helpers/asyncHandler.js');

router.post('/role', asyncHandler(rbacController.newRole));
router.get('/role', asyncHandler(rbacController.listRole));

router.post('/resource', asyncHandler(rbacController.newResource));
router.get('/resource', asyncHandler(rbacController.listResource));

module.exports = router;
