const { model, Schema } = require('mongoose');

const COLLECTION_NAME = 'Orders';
const DOCUMENT_NAME = 'Order';

const orderSchema = new Schema(
  {
    order_userId: {
      type: Number,
      require: true,
    },
    /**
     * totalPrice,
     * totalApplyDiscount
     * freeShip
     */

    order_checkout: {
      type: Object,
      default: {},
    },
    /**
     * street,
     * city
     * state
     * country
     */

    order_shipping: {
      type: Object,
      default: {},
    },
    order_payment: {
      type: Object,
      default: {},
    },
    order_product: {
      type: Array,
      require: true,
    },
    order_trackingNumber: {
      type: String,
    },
    order_status: {
      type: String,
      enum: ['pending', 'confirm', 'shipped', 'cancelled', 'delivered'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, orderSchema);
