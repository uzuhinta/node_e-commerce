const keyTokenModel = require('#src/models/keyToken.model.js');

class KeyTokenService {
  static createKeyToken = async ({ shopId, publicKey, refreshToken = null }) => {
    const publicKeyString = publicKey.toString();
    // const token = await keyTokenModel.create({
    //   shop: shopId,
    //   publicKey: publicKeyString,
    // });

    const token = await keyTokenModel.findOneAndUpdate(
      { shop: shopId },
      {
        publicKey: publicKeyString,
        refreshTokensUsed: [],
        refreshToken,
      },
      { new: true, upsert: true }
    );

    return token ? token.publicKey : null;
  };

  static findByShopId = async (shopId) => keyTokenModel.findOne({ shop: shopId });

  static deleteKeyById = async (id) => keyTokenModel.deleteOne(id);

  static deleteKeyByShopId = async (id) => keyTokenModel.deleteOne({ shop: id });

  static findByUsedRefreshToken = async (refreshTokenUsed) =>
    keyTokenModel.findOne({
      refreshTokensUsed: refreshTokenUsed,
    });

  static findByRefreshToken = async (refreshToken) =>
    keyTokenModel.findOne({
      refreshToken,
    });
}

module.exports = KeyTokenService;
