const PRODUCT_STATUS = require('#src/constants/productStatus.constant.js');
const { BadRequestError } = require('#src/core/error.response.js');
const { getSelectData, getUnselectData } = require('#src/utils/index.js');
const { Types } = require('mongoose');
const { productModel } = require('../product.model');

const findProductForShop = async ({ query, limit, page }) =>
  productModel
    .find(query)
    .populate('product_shop', '-_id name email')
    .sort({ updateAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()
    .exec();

const publishProductByShop = async ({ product_id, product_shop }) => {
  const storedProduct = await productModel.findOne({ _id: product_id, product_shop });
  if (!storedProduct) throw new BadRequestError(`Product ${product_id} does not exist`);

  storedProduct.status = PRODUCT_STATUS.PUBLISH;

  const savedProduct = await storedProduct.save();

  return savedProduct;
};

const draftProductByShop = async ({ product_id, product_shop }) => {
  const storedProduct = await productModel.findOne({ _id: product_id, product_shop });
  if (!storedProduct) throw new BadRequestError(`Product ${product_id} does not exist`);

  storedProduct.status = PRODUCT_STATUS.DRAFT;

  const savedProduct = await storedProduct.save();

  return savedProduct;
};

const searchProduct = async (keySearch) => {
  const regexSearch = new RegExp(keySearch);
  const results = await productModel
    .find(
      {
        status: PRODUCT_STATUS.PUBLISH,
        $text: { $search: regexSearch },
      },
      {
        score: { $meta: 'textScore' },
      }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();

  return results;
};

const findAllProduct = async ({ filter, limit, page, sortBy, select }) => {
  const skip = (page - 1) * limit;
  const sort = sortBy === 'ctime' ? { _id: -1 } : { _id: 1 };

  const results = await productModel
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return results;
};

const getOneProduct = async ({ product_id, unselect }) =>
  productModel
    .findOne({ _id: new Types.ObjectId(product_id) })
    .select(getUnselectData(unselect))
    .lean();

const updateProductById = async ({ productId, payload, model, isNew = true }) =>
  model.findByIdAndUpdate(productId, payload, { new: isNew });

const checkProduct = async (products) =>
  Promise.all(
    products.map(async (product) => {
      const storedProduct = await productModel.findById(product.productId);

      if (storedProduct) {
        return {
          price: storedProduct.product_price,
          quantity: product.quantity,
          productId: product.productId,
        };
      }
    })
  );

module.exports = {
  findProductForShop,
  publishProductByShop,
  draftProductByShop,
  searchProduct,
  findAllProduct,
  getOneProduct,
  updateProductById,
  checkProduct,
};
