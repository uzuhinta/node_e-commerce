const { OkResponse } = require('#src/core/success.response.js');
const ProductFactory = require('#src/services/product.service.js');

class ProductController {
  createProduct = async (req, res) => {
    new OkResponse({
      message: 'Create new product successfully',
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.shop.shopId,
      }),
    }).send(res);
  };

  getAllDraftsForShop = async (req, res) => {
    new OkResponse({
      message: 'Get draft products successfully',
      metadata: await ProductFactory.findAllDraftsForShop({
        ...req.query,
        product_shop: req.shop.shopId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res) => {
    new OkResponse({
      message: 'Get publish products successfully',
      metadata: await ProductFactory.findAllPublishForShop({
        ...req.query,
        product_shop: req.shop.shopId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res) => {
    new OkResponse({
      message: 'Publish products successfully',
      metadata: await ProductFactory.publishProductByShop({
        product_id: req.params.product_id,
        product_shop: req.shop.shopId,
      }),
    }).send(res);
  };

  draftProductByShop = async (req, res) => {
    new OkResponse({
      message: 'Draft products successfully',
      metadata: await ProductFactory.draftProductByShop({
        product_id: req.params.product_id,
        product_shop: req.shop.shopId,
      }),
    }).send(res);
  };

  searchProduct = async (req, res) => {
    new OkResponse({
      message: 'Search publish products successfully',
      metadata: await ProductFactory.searchProduct({
        keySearch: req.params.keySearch,
      }),
    }).send(res);
  };

  findAllProduct = async (req, res) => {
    new OkResponse({
      message: 'Get products successfully',
      metadata: await ProductFactory.findAllProduct(req.params),
    }).send(res);
  };

  getOneProduct = async (req, res) => {
    new OkResponse({
      message: 'Get products successfully',
      metadata: await ProductFactory.getOneProduct(req.params),
    }).send(res);
  };

  updateProduct = async (req, res) => {
    new OkResponse({
      message: 'Update products successfully',
      metadata: await ProductFactory.updateProduct({
        payload: req.body,
        product_shop: req.shop.shopId,
        type: req.body.product_type,
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
