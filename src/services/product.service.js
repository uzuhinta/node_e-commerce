const NOTIFICATION_TYPE = require('#src/constants/notiType.constant.js');
const PRODUCT_STATUS = require('#src/constants/productStatus.constant.js');
const { BadRequestError } = require('#src/core/error.response.js');
const { productModel, clothingModel, electronicModel } = require('#src/models/product.model.js');
const { createInventory } = require('#src/models/repositories/inventory.repository.js');
const {
  findProductForShop,
  publishProductByShop,
  draftProductByShop,
  searchProduct,
  findAllProduct,
  getOneProduct,
  updateProductById,
} = require('#src/models/repositories/product.repository.js');
const { updateNestedObjectParser, removeUndefinedObjectParser } = require('#src/utils/index.js');
const { pushNotificationToSystem } = require('./notification.service');

class ProductFactory {
  static productRegistry = [];

  static registerProductType(type, classRef) {
    this.productRegistry[type] = classRef;
  }

  static createProduct = async (type, payload) => {
    const productClass = this.productRegistry[type];
    if (!productClass) throw new BadRequestError(`Product type: ${type} is not support`);
    return new productClass(payload).createProduct();
  };

  static findAllDraftsForShop = async ({ product_shop, limit = 50, page = 1 }) => {
    const query = { product_shop, status: PRODUCT_STATUS.DRAFT };
    return findProductForShop({ query, limit, page });
  };

  static findAllPublishForShop = async ({ product_shop, limit = 50, page = 1 }) => {
    const query = { product_shop, status: PRODUCT_STATUS.PUBLISH };
    return findProductForShop({ query, limit, page });
  };

  static publishProductByShop = async ({ product_shop, product_id }) =>
    publishProductByShop({ product_shop, product_id });

  static draftProductByShop = async ({ product_shop, product_id }) => draftProductByShop({ product_shop, product_id });

  static searchProduct = async ({ keySearch }) => searchProduct(keySearch);

  static findAllProduct = async ({
    filter = { status: PRODUCT_STATUS.PUBLISH },
    limit = 50,
    page = 1,
    sortBy = 'ctime',
  }) =>
    findAllProduct({ filter, limit, page, sortBy, select: ['_id', 'product_name', 'product_price', 'product_thumb'] });

  static getOneProduct = async ({ product_id }) => getOneProduct({ product_id, unselect: ['__v'] });

  static updateProduct = async ({ type, product_id, payload }) => {
    const productClass = this.productRegistry[type];
    if (!productClass) throw new BadRequestError(`Product type: ${type} is not support`);
    return new productClass(payload).updateProduct(product_id);
  };
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attribute,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attribute = product_attribute;
  }

  async createProduct(productId) {
    const newProduct = await productModel.create({ ...this, _id: productId });
    if (newProduct) {
      await createInventory({
        productId: newProduct._id,
        shopId: newProduct.product_shop,
        stock: newProduct.product_quantity,
      });

      pushNotificationToSystem({
        type: NOTIFICATION_TYPE.SHOP_001,
        receiveId: 1,
        senderId: this.product_shop,
        options: {
          product_name: this.product_name,
          shop_name: this.product_shop,
        },
      })
        .then((rs) => console.log(rs))
        .catch(console.error);
    }
    return newProduct;
  }

  async updateProduct(productId, payload) {
    return await updateProductById({ productId, payload: updateNestedObjectParser(payload), model: productModel });
  }
}

class ClothingProduct extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({ ...this.product_attribute, product_shop: this.product_shop });
    if (!newClothing) throw new BadRequestError('Can not create clothing');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('Can not create product');

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParam = this;

    if (objectParam.product_attribute) {
      await updateProductById({
        productId,
        payload: removeUndefinedObjectParser({ ...objectParam.product_attribute }),
        model: clothingModel,
      });
    }

    const updatedProduct = super.updateProduct(productId, objectParam);
    return updatedProduct;
  }
}

class ElectronicProduct extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create({ ...this.product_attribute, product_shop: this.product_shop });
    if (!newElectronic) throw new BadRequestError('Can not create electronic');

    const newProduct = super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('Can not create product');

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParam = this;

    if (objectParam.product_attribute) {
      await updateProductById({
        productId,
        payload: removeUndefinedObjectParser({ ...objectParam.product_attribute }),
        model: electronicModel,
      });
    }

    const updatedProduct = super.updateProduct(productId, objectParam);
    return updatedProduct;
  }
}

ProductFactory.registerProductType('Clothing', ClothingProduct);
ProductFactory.registerProductType('Electronic', ElectronicProduct);

module.exports = ProductFactory;
