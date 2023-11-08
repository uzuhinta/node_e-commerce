const { OkResponse } = require('#src/core/success.response.js');
const ProductFactory = require('#src/services/product.service.js');

class ProductController {
  createProduct = async (req, res) => {
    console.log('ProductFactory', ProductFactory);
    new OkResponse({
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.shop.shopId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
