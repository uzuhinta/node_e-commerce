const express = require('express');
const router = express.Router();

const profileController = require('#src/controllers/profile.controller.js');
const grantAccess = require('#src/middlewares/rbac.middleware.js');

router.get('/viewAny', grantAccess('readAny', 'profile'), profileController.profiles);

router.get('/viewOwn', grantAccess('readOwn', 'profile'), profileController.profile);

module.exports = router;
