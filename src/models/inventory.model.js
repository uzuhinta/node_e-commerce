const { model, Schema } = require('mongoose');

const COLLECTION_NAME = 'Inventories';
const DOCUMENT_NAME = 'Inventory';

const inventorySchema = new Schema(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    inven_location: { type: String, default: 'unknown' },
    inven_stock: {
      type: Number,
      require: true,
    },
    inven_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    /*
      cartId:
      stock:
      createdOn
    */
    inven_reservation: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
