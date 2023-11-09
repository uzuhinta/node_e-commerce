const { OkResponse } = require('#src/core/success.response.js');
const DiscountService = require('#src/services/discount.service.js');

class DiscountController {
  createDiscount = async (req, res) => {
    new OkResponse({
      message: 'Create new discount successfully',
      metadata: await DiscountService.createDiscount({ ...req.body, shop_id: req.shop.shopId }),
    }).send(res);
  };

  updateDiscount = async (req, res) => {
    new OkResponse({
      message: 'Update discount successfully',
      metadata: await DiscountService.updateDiscount(req.params.discount_id, { ...req.body, shop_id: req.shop.shopId }),
    }).send(res);
  };

  getAllDiscount = async (req, res) => {
    new OkResponse({
      message: 'Get discount successfully',
      metadata: await DiscountService.getAllDiscount({
        shop_id: req.shop.shopId,
        page: req.query.page,
        limit: req.query.limit,
        is_active: req.query.is_active,
      }),
    }).send(res);
  };

  getAllProductsUseDiscount = async (req, res) => {
    new OkResponse({
      message: 'Get product can apply discount successfully',
      metadata: await DiscountService.getAllProductsUseDiscount(req.query),
    }).send(res);
  };

  deleteDiscount = async (req, res) => {
    new OkResponse({
      message: 'Delete discount successfully',
      metadata: await DiscountService.deleteDiscount({
        shopId: req.shop.shopId,
        discountId: req.params.discount_id,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res) => {
    new OkResponse({
      message: 'Get discount amount successfully',
      metadata: await DiscountService.getDiscountAmount(req.body),
    }).send(res);
  };

  cancelDiscount = async (req, res) => {
    new OkResponse({
      message: 'Cancel discount for user successfully',
      metadata: await DiscountService.cancelDiscount({
        shopId: req.body.shopId,
        codeId: req.body.codeId,
        userId: req.body.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
