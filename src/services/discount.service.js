const PRODUCT_STATUS = require('#src/constants/productStatus.constant.js');
const { BadRequestError, ConflictError, NotFoundError } = require('#src/core/error.response.js');
const {
  findOneDiscountByShopAndCode,
  createDiscount,
  findDiscountUnselect,
  findDiscountByIdAndShopID,
  updateDiscountById,
  findOne,
  deleteDiscount,
} = require('#src/models/repositories/discount.repository.js');
const { findAllProduct } = require('./product.service');
const { removeUndefinedObjectParser } = require('#src/utils/index.js');
const discountModel = require('#src/models/discount.model.js');

class DiscountService {
  static async createDiscount(payload) {
    const { code, start_date, end_date, shop_id } = payload;

    if (new Date(start_date) >= new Date(end_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError();
    }

    const storedDiscount = await findOneDiscountByShopAndCode({ code, shop_id });
    console.log('storedDiscount', storedDiscount);
    if (storedDiscount) throw new ConflictError(`Discount code: ${code} exist`);

    return createDiscount(payload);
  }

  static async updateDiscount(discount_id, payload) {
    const storedDiscount = await findDiscountByIdAndShopID({ discountId: discount_id, shopId: payload.shop_id });
    if (!storedDiscount) throw new NotFoundError(`Discount ${discount_id} does not exist`);

    return updateDiscountById({ discountId: discount_id, payload: removeUndefinedObjectParser(payload) });
  }

  static async getAllProductsUseDiscount({ code, shop_id, limit, page }) {
    const storedDiscount = await findOneDiscountByShopAndCode({ code, shop_id });
    if (!storedDiscount || storedDiscount.discount_is_active === false) {
      throw new BadRequestError(`Discount code ${code} not exist or inactive`);
    }

    const { discount_product_ids, discount_applies_to } = storedDiscount;

    let products;

    if (discount_applies_to === 'all') {
      products = findAllProduct({
        filter: { product_shop: shop_id, status: PRODUCT_STATUS.PUBLISH },
        sortBy: 'ctime',
        limit: +limit,
        page: +page,
      });
    }

    if (discount_applies_to === 'specific') {
      products = findAllProduct({
        filter: { _id: { $in: discount_product_ids }, status: PRODUCT_STATUS.PUBLISH },
        sortBy: 'ctime',
        limit: +limit,
        page: +page,
      });
    }

    return products;
  }

  static async getAllDiscount({ shop_id, limit = 50, page = 1, is_active }) {
    const filter =
      is_active === undefined
        ? {
            discount_shop_id: shop_id,
          }
        : {
            discount_shop_id: shop_id,
            discount_is_active: is_active,
          };
    const storedDiscount = await findDiscountUnselect({
      filter,
      limit: +limit,
      page: +page,
      unselect: ['__v', 'discount_shop_id'],
    });

    return storedDiscount;
  }

  static async getDiscountAmount({ codeId, shopId, userId, products }) {
    const storedDiscount = await findOne({
      filter: {
        discount_code: codeId,
        discount_shop_id: shopId,
      },
    });
    if (!storedDiscount) throw new NotFoundError(`Discount ${codeId} does not exist`);

    const {
      discount_is_active,
      discount_max_use,
      discount_start_date,
      discount_end_date,
      discount_min_order,
      discount_max_use_per_user,
      discount_user_used,
      discount_type,
      discount_value,
    } = storedDiscount;
    if (!discount_is_active) throw new NotFoundError('Discount inactive');
    if (!discount_max_use) throw new NotFoundError('Discount are out!');

    if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
      throw new NotFoundError('Discount are outdate!');
    }

    let totalPriceOrder = 0;

    if (discount_min_order) {
      totalPriceOrder = products.reduce((acc, { quantity, price }) => acc + quantity * price, 0);
      if (totalPriceOrder < discount_min_order) {
        throw new NotFoundError('Discount require minimum order');
      }
    }

    if (discount_max_use_per_user > 0) {
      const userUsed = discount_user_used.find((user) => user.userId === userId);
      if (userUsed) {
        throw new BadRequestError('User used this discount');
      }
    }

    const amount = discount_type === 'fixed_amount' ? discount_value : (totalPriceOrder * discount_value) / 100;

    return {
      totalPriceOrder,
      amount,
      totalPrice: totalPriceOrder - amount,
    };
  }

  static async deleteDiscount({ discountId, shopId }) {
    return deleteDiscount({ filter: { _id: discountId, discount_shop_id: shopId } });
  }

  static async cancelDiscount({ userId, shopId, codeId }) {
    const storedDiscount = await findOne({
      filter: {
        discount_code: codeId,
        discount_shop_id: shopId,
      },
    });
    if (!storedDiscount) throw new NotFoundError(`Discount ${codeId} does not exist`);

    const result = await discountModel.findByIdAndUpdate(storedDiscount._id, {
      $pull: {
        discount_user_used: userId,
      },
      $inc: {
        discount_use_count: -1,
        discount_max_use: 1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
