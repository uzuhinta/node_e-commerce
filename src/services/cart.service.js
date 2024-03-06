const CART_STATE = require('#src/constants/cartState.constant.js');
const {
  createUserCart,
  findByUserId,
  updateProductQuantityUserCart,
  findOne,
  updateOne,
} = require('#src/models/repositories/cart.repository.js');
const { Types } = require('mongoose');
const { getOneProduct } = require('./product.service.js');

class CartService {
  static async addToCart({ userId, product = {} }) {
    const userCart = await findByUserId(userId);

    const { productId, quantity } = product;

    const storedProduct = await getOneProduct({ product_id: productId });

    // if user has not had cart yet
    if (!userCart) {
      return await createUserCart({
        filter: { cart_user_id: userId, cart_state: CART_STATE.ACTIVE },
        product: { ...storedProduct, quantity },
      });
    }

    // if cart does not contain product
    if (!userCart.cart_products.length) {
      userCart.cart_products = [{ ...storedProduct, quantity }];
      userCart.cart_state = CART_STATE.ACTIVE;
      return await userCart.save();
    }

    //
    const storedProductInCart = await findOne({
      'cart_products._id': new Types.ObjectId(productId),
    });

    // if product has already in cart product
    if (storedProductInCart) {
      return updateProductQuantityUserCart({
        filter: { cart_user_id: userId, 'cart_products._id': storedProduct._id },
        quantity,
      });
    }

    userCart.cart_products.push({ ...storedProduct, quantity });
    userCart.cart_state = CART_STATE.ACTIVE;
    return await userCart.save();
  }

  static async deleteFromCart({ userId, productId }) {
    const filter = { cart_user_id: userId, cart_state: CART_STATE.ACTIVE };
    const updateSet = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };
    return updateOne({ filter, updateSet });
  }

  static async getCart({ userId }) {
    return findOne({ cart_user_id: userId, cart_state: CART_STATE.ACTIVE });
  }
}

module.exports = CartService;
