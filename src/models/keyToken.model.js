const { model, Schema, SchemaTypes } = require('mongoose');

const COLLECTION_NAME = 'KeyTokens';
const DOCUMENT_NAME = 'KeyToken';

const keyTokenSchema = new Schema(
  {
    shop: {
      type: SchemaTypes.ObjectId,
      require: true,
      ref: 'Shop',
    },
    publicKey: {
      type: String,
      require: true,
    },
    refreshToken: {
      type: String,
      require: true,
    },
    refreshTokensUsed: {
      type: SchemaTypes.Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
