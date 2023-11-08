const bcrypt = require('bcrypt');

const SHOP_ROLE = require('#src/constants/shopRole.constant.js');
const shopModel = require('#src/models/shop.model.js');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, createAsymmetricKeyPair } = require('#src/auth/jwt.js');
const { getInfoData } = require('#src/utils/index.js');
const {
  ConflictError,
  InternalServerError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} = require('#src/core/error.response.js');
const ShopService = require('./shop.service');

class AccessService {
  static login = async ({ email, password }) => {
    const storedShop = await ShopService.findByEmail(email);
    if (!storedShop) throw new BadRequestError('Shop does not register');

    const match = bcrypt.compare(password, storedShop.password);
    if (!match) throw new UnauthorizedError();

    const { _id: shopId } = storedShop;
    const { privateKey, publicKey } = createAsymmetricKeyPair();
    const token = createTokenPair({ shopId, email }, privateKey);
    await KeyTokenService.createKeyToken({
      shopId,
      publicKey,
      refreshToken: token.refreshToken,
    });

    return {
      shop: getInfoData(['_id', 'email', 'name'], storedShop),
      token,
    };
  };

  static logout = async ({ keyToken }) => KeyTokenService.deleteKeyById(keyToken._id);

  static handleRefreshToken = async ({ storedKeyToken, refreshToken, shop }) => {
    const { shopId, email } = shop;

    if (storedKeyToken.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyByShopId(shopId);

      throw new ForbiddenError('Please login again!');
    }

    const storedShop = await ShopService.findById(shopId);
    if (!storedShop) throw new UnauthorizedError('Shop does not register');

    const { privateKey, publicKey } = createAsymmetricKeyPair();
    const token = createTokenPair({ shopId, email }, privateKey);

    await storedKeyToken.updateOne({
      $set: {
        refreshToken: token.refreshToken,
        publicKey: publicKey.toString(),
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      shop: {
        _id: shopId,
        email,
      },
      token,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // Check email is exist or not
    const storedStop = await shopModel.findOne({ email }).lean();
    if (storedStop) throw new ConflictError('Shop already registered!');

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newShop = await shopModel.create({
      name,
      email,
      password: hashPassword,
      role: [SHOP_ROLE.SHOP],
    });
    if (!newShop) throw new InternalServerError();

    const { privateKey, publicKey } = createAsymmetricKeyPair();
    const token = createTokenPair({ shopId: newShop._id, email }, privateKey);
    const publicKeyString = await KeyTokenService.createKeyToken({ shopId: newShop._id, publicKey });
    if (!publicKeyString) throw new InternalServerError();

    return {
      shop: getInfoData(['_id', 'name', 'email'], newShop),
      token,
    };
  };
}

module.exports = AccessService;
