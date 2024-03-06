const { BadRequestError } = require('#src/core/error.response.js');
const inventoryModel = require('#src/models/inventory.model.js');
const { getOneProduct } = require('./product.service');

class InventoryService {
  static async addStockToInventory({ stock, productId, shopId, location = 'unknown' }) {
    const product = await getOneProduct({ product_id: productId });

    if (!product) {
      throw new BadRequestError('The product does not exists');
    }

    const query = { inven_shopId: shopId, inven_productId: productId };

    const updateSet = {
      $inc: {
        inven_stock: stock,
      },
      $set: {
        inven_location: location,
      },
    };

    const options = { upsert: true, new: true };

    return await inventoryModel.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
