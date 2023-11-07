const apiKeyModel = require('#src/models/apiKey.model.js');

class ApiKeyService {
  static findByKey = async (key) =>
    apiKeyModel
      .findOne({
        key,
        status: true,
      })
      .lean();
}

module.exports = ApiKeyService;
