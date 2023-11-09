const { model, Schema, SchemaTypes } = require('mongoose');

const COLLECTION_NAME = 'Discounts';
const DOCUMENT_NAME = 'Discount';

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      require: true,
    },
    discount_description: {
      type: String,
    },
    discount_type: {
      type: String,
      default: 'fixed_amount',
      enum: ['fixed_amount', 'percentage'],
    },
    discount_value: {
      type: Number,
      require: true,
    },
    discount_code: {
      type: String,
      require: true,
    },
    discount_start_date: {
      type: Date,
      require: true,
    },
    discount_end_date: {
      type: Date,
      require: true,
    },
    discount_max_use: {
      type: Number,
      require: true,
    },
    discount_use_count: {
      type: Number,
      require: true,
    },
    discount_max_use_per_user: {
      type: Number,
    },
    discount_user_used: {
      type: Array,
      default: [],
    },
    discount_min_order: {
      type: Number,
    },
    discount_shop_id: {
      type: SchemaTypes.ObjectId,
      ref: 'Shop',
    },
    discount_is_active: {
      type: Boolean,
      default: false,
    },
    discount_applies_to: {
      type: String,
      require: true,
      enum: ['all', 'specific'],
    },
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
