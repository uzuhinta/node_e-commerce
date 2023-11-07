const shopModel = require('#src/models/shop.model.js');

class ShopService {
  static findByEmail = (email, selectField = { _id: 1, email: 1, password: 1, name: 1 }) =>
    shopModel.findOne({ email }).select(selectField).lean();
}

module.exports = ShopService;
