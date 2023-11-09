const { getUnselectData, getSelectData } = require('#src/utils/index.js');
const discountModel = require('../discount.model');

const createDiscount = async ({
  name,
  description,
  type,
  value,
  code,
  start_date,
  end_date,
  max_use,
  max_use_per_user,
  min_order,
  shop_id,
  is_active,
  applies_to,
  product_ids,
}) =>
  discountModel.create({
    discount_name: name,
    discount_description: description,
    discount_type: type,
    discount_value: value,
    discount_code: code,
    discount_start_date: new Date(start_date),
    discount_end_date: new Date(end_date),
    discount_max_use: max_use,
    discount_max_use_per_user: max_use_per_user,
    discount_min_order: min_order,
    discount_shop_id: shop_id,
    discount_is_active: is_active,
    discount_applies_to: applies_to,
    discount_product_ids: applies_to === 'all' ? [] : product_ids,
  });

const findDiscountByIdAndShopID = async ({ discountId, shopId }) =>
  discountModel
    .findOne({
      _id: discountId,
      discount_shop_id: shopId,
    })
    .lean();

const updateDiscountById = async ({ discountId, payload, isNew = true }) =>
  discountModel.findByIdAndUpdate(discountId, payload, { new: isNew });

const findOneDiscountByShopAndCode = async ({ code, shop_id }) =>
  discountModel
    .findOne({
      discount_code: code,
      discount_shop_id: shop_id,
    })
    .lean();

const findDiscountUnselect = async ({ filter, sortBy, limit = 50, page = 1, unselect }) => {
  const skip = (page - 1) * limit;
  const sort = sortBy === 'ctime' ? { _id: -1 } : { _id: 1 };

  return discountModel.find(filter).skip(skip).limit(limit).sort(sort).select(getUnselectData(unselect)).lean();
};

const findDiscountSelect = async ({ filter, sortBy, limit = 50, page = 1, select }) => {
  const skip = (page - 1) * limit;
  const sort = sortBy === 'ctime' ? { _id: -1 } : { _id: 1 };

  return discountModel.find(filter).skip(skip).limit(limit).sort(sort).select(getSelectData(select)).lean();
};

const findOne = async ({ filter }) => discountModel.findOne(filter).lean();

const deleteDiscount = async ({ filter }) => discountModel.findOneAndDelete(filter).lean();

module.exports = {
  findDiscountByIdAndShopID,
  updateDiscountById,
  findOneDiscountByShopAndCode,
  createDiscount,
  findDiscountUnselect,
  findDiscountSelect,
  findOne,
  deleteDiscount,
};
