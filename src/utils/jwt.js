const JWT = require('jsonwebtoken');

const createTokenPair = (payload, privateKey) => {
  const accessToken = JWT.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '2 days',
  });

  const refreshToken = JWT.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '2 days',
  });

  return { accessToken, refreshToken };
};

module.exports = createTokenPair;
