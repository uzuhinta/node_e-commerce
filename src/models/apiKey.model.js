const { model, Schema, SchemaTypes } = require('mongoose');

const COLLECTION_NAME = 'ApiKeys';
const DOCUMENT_NAME = 'ApiKey';

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      unique: true,
      require: true,
    },
    status: {
      type: SchemaTypes.Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      require: true,
      enum: ['0000', '1111', '2222'],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, apiKeySchema);
