const crypto = require('crypto');
const JWT = require('jsonwebtoken');

const createTokenPair = (payload, privateKey) => {
  const accessToken = JWT.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '2 days',
  });

  const refreshToken = JWT.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '7 days',
  });

  return { accessToken, refreshToken };
};

const createAsymmetricKeyPair = () => {
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

  return { privateKey, publicKey };
};

const decodeToken = (token, secret) => {
  const { shopId, email } = JWT.decode(token, secret);
  return { shopId, email };
};

module.exports = {
  createTokenPair,
  createAsymmetricKeyPair,
  decodeToken,
};
