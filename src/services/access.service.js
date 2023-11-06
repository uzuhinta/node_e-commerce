const bcrypt = require('bcrypt');
const crypto = require('crypto');

const ShopRole = require('#src/constants/shopRole.constant.js');
const shopModel = require('#src/models/shop.model.js');
const KeyTokenService = require('./keyToken.service');
const createTokenPair = require('#src/utils/jwt.js');
const { getInfoData } = require('#src/utils/index.js');

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // Check email is exist or not
      const storedStop = await shopModel.findOne({ email }).lean();

      if (storedStop) {
        return {
          code: 409,
          message: 'Shop already exist',
        };
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newShop = await shopModel.create({
        name,
        email,
        password: hashPassword,
        role: [ShopRole.SHOP],
      });

      if (newShop) {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
        });

        const publicKeyString = await KeyTokenService.createKeyToken({ shopId: newShop._id, publicKey });

        if (!publicKeyString) {
          return {
            code: 500,
            message: 'Server error',
          };
        }

        const token = createTokenPair({ shopId: newShop._id, email }, privateKey);

        return {
          code: 201,
          metadata: {
            shop: getInfoData(['_id', 'name', 'email'], newShop),
            token,
          },
        };
      }

      return {
        code: 201,
        message: 'Shop created ', // Redirect to login page
      };
    } catch (error) {
      return {
        code: 404,
        message: error.message,
        status: 'error',
      };
    }
  };
}

module.exports = AccessService;
