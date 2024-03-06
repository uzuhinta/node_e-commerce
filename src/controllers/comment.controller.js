const { CreatedResponse, OkResponse } = require('#src/core/success.response.js');
const CommentService = require('#src/services/comment.service.js');

class CommentController {
  createComment = async (req, res) => {
    new CreatedResponse({
      message: 'Create new comment!',
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  };

  getComment = async (req, res) => {
    new OkResponse({
      message: 'Get comment!',
      metadata: await CommentService.getCommentByParentId(req.query),
    }).send(res);
  };

  deleteComment = async (req, res) => {
    new OkResponse({
      message: 'Get comment!',
      metadata: await CommentService.deleteCommentById(req.body),
    }).send(res);
  };
}

module.exports = new CommentController();
