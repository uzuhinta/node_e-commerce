const { model, Schema } = require('mongoose');

const COLLECTION_NAME = 'Templates';
const DOCUMENT_NAME = 'Template';

const templaceSchema = new Schema(
  {
    tem_id: { type: Number, require: true },
    tem_name: { type: String, require: true },
    tem_status: { type: String, default: 'active' },
    tem_html: { type: String, require: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, templaceSchema);
