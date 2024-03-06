const { OkResponse } = require('#src/core/success.response.js');
const CartService = require('#src/services/cart.service.js');

class CartController {
  getCart = async (req, res) => {
    new OkResponse({
      message: 'List cart successfully',
      metadata: await CartService.getCart(req.query),
    }).send(res);
  };

  addToCart = async (req, res) => {
    new OkResponse({
      message: 'Add to cart successfully',
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  deleteFromCart = async (req, res) => {
    new OkResponse({
      message: 'Delete from cart successfully',
      metadata: await CartService.deleteFromCart(req.body),
    }).send(res);
  };
}

module.exports = new CartController();
