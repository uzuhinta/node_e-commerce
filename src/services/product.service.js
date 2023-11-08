const { BadRequestError } = require('#src/core/error.response.js');
const { productModel, clothingModel, electronicModel } = require('#src/models/product.model.js');

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
    console.log('Product', productId);
    return await productModel.create({ ...this, _id: productId });
  }
}

class ClothingProduct extends Product {
  async createProduct() {
    console.log('ClothingProduct', this);

    const newClothing = await clothingModel.create({ ...this.product_attribute, product_shop: this.product_shop });
    if (!newClothing) throw new BadRequestError('Can not create clothing');

    const newProduct = super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('Can not create product');

    return newProduct;
  }
}

class ElectronicProduct extends Product {
  async createProduct() {
    console.log('ElectronicProduct', this);

    const newElectronic = await electronicModel.create({ ...this.product_attribute, product_shop: this.product_shop });
    if (!newElectronic) throw new BadRequestError('Can not create electronic');

    const newProduct = super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('Can not create product');

    return newProduct;
  }
}

ProductFactory.registerProductType('Clothing', ClothingProduct);
ProductFactory.registerProductType('Electronic', ElectronicProduct);

module.exports = ProductFactory;
