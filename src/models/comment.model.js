const { Schema, model } = require('mongoose');

const COLLECTION_NAME = 'Comments';
const DOCUMENT_NAME = 'Comment';

const commentSchema = new Schema(
  {
    comment_productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    comment_userId: {
      type: Number,
      require: true,
    },
    comment_content: {
      type: String,
      default: '',
    },
    comment_left: {
      type: Number,
      default: 0,
    },
    comment_right: {
      type: Number,
      default: 0,
    },
    comment_parentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, commentSchema);
