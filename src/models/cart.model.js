const { model, Schema } = require('mongoose');

const COLLECTION_NAME = 'Carts';
const DOCUMENT_NAME = 'Cart';

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      default: 'active',
      enum: ['active', 'completed', 'failed', 'pending'],
    },
    /**
     * [{productId, shopId, quantity, ~name, ~price}]
     */
    cart_products: {
      type: Array,
      default: [],
      require: true,
    },
    cart_count_product: {
      type: Number,
      default: 0,
    },
    cart_user_id: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, cartSchema);
