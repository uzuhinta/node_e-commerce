const { OkResponse } = require('#src/core/success.response.js');
const CheckoutService = require('#src/services/checkout.service.js');

class CheckoutController {
  checkoutReview = async (req, res) => {
    new OkResponse({
      message: 'Checkout',
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };
}

module.exports = new CheckoutController();
