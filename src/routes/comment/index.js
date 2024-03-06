const express = require('express');
const router = express.Router();

const asyncHandler = require('#src/helpers/asyncHandler.js');
const commentController = require('#src/controllers/comment.controller.js');
const { authentication } = require('#src/auth/checkAuth.js');

router.use(authentication);

router.post('', asyncHandler(commentController.createComment));
router.get('', asyncHandler(commentController.getComment));
router.delete('', asyncHandler(commentController.deleteComment));

module.exports = router;
