const { NotFoundError } = require('#src/core/error.response.js');
const Comment = require('../models/comment.model.js');
const { getOneProduct } = require('./product.service.js');

class CommentService {
  static async createComment({ productId, userId, content, parentCommentId = null }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        throw new NotFoundError('Parent comment not found');
      }
      rightValue = parentComment.comment_right;

      await Comment.updateMany(
        {
          comment_productId: productId,
          comment_right: { $gte: rightValue },
        },
        {
          $inc: {
            comment_right: 2,
          },
        }
      );

      await Comment.updateMany(
        {
          comment_productId: productId,
          comment_left: { $gt: rightValue },
        },
        {
          $inc: {
            comment_left: 2,
          },
        }
      );
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: productId,
        },
        'comment_right',
        { sort: { comment_right: -1 } }
      );

      if (maxRightValue) {
        rightValue = maxRightValue + 1;
      } else {
        rightValue = 1;
      }
    }

    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  // eslint-disable-next-line no-unused-vars
  static async getCommentByParentId({ productId, parentCommentId = null, limit = 50, offset = 0 }) {
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        throw new NotFoundError('Parent comment not found');
      }

      const comments = await Comment.find({
        comment_productId: productId,
        comment_left: { $gt: parentComment.comment_left },
        comment_right: { $lte: parentComment.comment_right },
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        });

      return comments;
    }

    const comments = await Comment.find({
      comment_parentId: parentCommentId,
      comment_productId: productId,
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({
        comment_left: 1,
      });

    return comments;
  }

  static async deleteCommentById({ productId, commentId }) {
    const product = await getOneProduct(productId);
    if (!product) {
      throw new NotFoundError('Product not found!');
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw NotFoundError('Comment not found!');
    }

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;
    const width = rightValue - leftValue + 1;

    await Comment.deleteMany({
      comment_productId: productId,
      comment_left: { $gte: leftValue, $lte: rightValue },
    });

    await Comment.updateMany(
      {
        comment_productId: productId,
        comment_right: { $gt: rightValue },
      },
      {
        $inc: {
          comment_right: -width,
        },
      }
    );

    await Comment.updateMany(
      {
        comment_productId: productId,
        comment_left: { $gt: leftValue },
      },
      {
        $inc: {
          comment_left: -width,
        },
      }
    );
  }
}

module.exports = CommentService;
