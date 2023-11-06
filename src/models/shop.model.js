const { model, Schema, SchemaTypes } = require('mongoose');

const COLLECTION_NAME = 'Shops';
const DOCUMENT_NAME = 'Shop';

const shopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    verify: {
      type: SchemaTypes.Boolean,
      default: false,
    },
    role: {
      type: SchemaTypes.Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, shopSchema);
