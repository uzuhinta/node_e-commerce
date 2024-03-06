/* eslint-disable no-unused-vars */
const { NotFoundError, BadRequestError } = require('#src/core/error.response.js');
const orderModel = require('#src/models/order.model.js');
const { findOne } = require('#src/models/repositories/cart.repository.js');
const { checkProduct } = require('#src/models/repositories/product.repository.js');
const { getDiscountAmount } = require('./discount.service');
const { acquireLock, releaseLock } = require('./redis.service');

class CheckoutService {
  /**
   * shop_order_ids: [{shopId, shopDiscount: [], item_products: [{price, quantity, productId}]}]
   */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const storedCart = await findOne({ _id: cartId });
    if (!storedCart) throw new NotFoundError('Cart not found');

    const checkoutOrder = {
      totalPrice: 0,
      freeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };

    const shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shopDiscount, item_products } = shop_order_ids[i];
      const checkProductServer = await checkProduct(item_products);
      if (!checkProductServer[0]) throw new BadRequestError('order wrong');

      const checkoutPrice = checkProductServer.reduce((acc, product) => acc + product.price * product.quantity, 0);

      checkoutOrder.totalPrice = checkoutPrice;

      const itemCheckout = {
        shopId,
        shopDiscount,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      if (shopDiscount.length > 0) {
        const { amount } = await getDiscountAmount({
          codeId: shopDiscount[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });

        checkoutOrder.totalDiscount += amount;

        if (amount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - amount;
        }
      }

      checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkoutOrder,
    };
  }

  static async orderByUser({ shop_order_ids, userId, cartId, userAddress = {}, userPayment = {} }) {
    const { shop_order_ids_new, checkoutOrder } = this.checkoutReview({
      cartId,
      userId,
      shop_order_ids,
    });

    const orderProduct = shop_order_ids_new.flatMap((order) => order.item_products);

    const acquireProduct = [];

    for (let i = 0; i < orderProduct.length; i++) {
      const { productId, quantity } = orderProduct[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // if there are many out stock
    if (acquireProduct.includes(true)) {
      throw new BadRequestError('Some product are updated, please check cart again!');
    }

    // const newOrder = await orderModel.create({
    //   order_userId: userId,
    //   order_checkout: checkoutOrder,
    //   order_shipping: userAddress,
    //   order_payment: userPayment,
    //   order_product: shop_order_ids_new
    // });

    // remove product in cart
    // if(newOrder){}
  }
}

module.exports = CheckoutService;
