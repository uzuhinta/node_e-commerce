const { model, Schema } = require('mongoose');

const COLLECTION_NAME = 'Resources';
const DOCUMENT_NAME = 'Resource';

const resourceSchema = new Schema(
  {
    src_name: { type: String, require: true },
    src_slug: { type: String, require: true },
    src_description: { type: String, default: '' },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, resourceSchema);
