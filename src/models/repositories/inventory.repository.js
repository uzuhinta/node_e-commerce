const inventoryModel = require('../inventory.model.js');

const createInventory = async ({ productId, shopId, stock, location = 'unknown' }) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inven_productId: productId,
    inven_stock: { $gte: quantity },
  };

  const updateSet = {
    $inc: {
      inven_stock: -quantity,
    },
    $push: {
      inven_reservation: {
        quantity,
        cartId,
        createOn: new Date(),
      },
    },
  };

  const option = { upsert: true, new: true };

  return await inventoryModel.updateOne(query, updateSet, option);
};

module.exports = {
  createInventory,
  reservationInventory,
};
