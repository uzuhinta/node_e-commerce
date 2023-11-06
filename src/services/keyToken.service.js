const keyTokenModel = require('#src/models/keyToken.model.js');

class KeyTokenService {
  static createKeyToken = async ({ shopId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const token = await keyTokenModel.create({
        shop: shopId,
        publicKey: publicKeyString,
      });

      return token ? token.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
