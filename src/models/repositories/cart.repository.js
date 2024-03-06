const cartModel = require('../cart.model');

const findByUserId = async (userId) =>
  cartModel.findOne({
    cart_user_id: userId,
  });

const findOne = async (filter) => cartModel.findOne(filter).lean();

const updateOne = async ({ filter, updateSet }) => cartModel.updateOne(filter, updateSet);

const createUserCart = async ({ filter, product, option = { upsert: true, new: true } }) => {
  const updateOrInsert = {
    $addToSet: {
      cart_products: product,
    },
  };

  return cartModel.findOneAndUpdate(filter, updateOrInsert, option);
};

const updateProductQuantityUserCart = async ({ filter, quantity, option = { upsert: true, new: true } }) => {
  const updateSet = {
    $inc: { 'cart_products.$.quantity': quantity },
  };

  return cartModel.findOneAndUpdate(filter, updateSet, option);
};

module.exports = {
  findByUserId,
  findOne,
  updateOne,
  createUserCart,
  updateProductQuantityUserCart,
};
