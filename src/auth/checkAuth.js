const JWT = require('jsonwebtoken');
const crypto = require('crypto');

const HEADER = require('#src/constants/header.constant.js');
const { ForbiddenError, BadRequestError } = require('#src/core/error.response.js');
const ApiKeyService = require('#src/services/apiKey.service.js');
const KeyTokenService = require('#src/services/keyToken.service.js');
const asyncHandler = require('#src/helpers/asyncHandler.js');

const apiKey = asyncHandler(async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString();
  if (!key) return next(new BadRequestError());

  const storedApiKey = await ApiKeyService.findByKey(key);
  if (!storedApiKey) return next(new ForbiddenError());

  req.apiKey = storedApiKey;
  next();
});

const permission = (permission) => (req, res, next) => {
  if (!req.apiKey.permissions?.includes(permission)) return next(new ForbiddenError());

  next();
};

const authentication = asyncHandler(async (req, res, next) => {
  const shopId = req.headers[HEADER.CLIENT_ID];
  if (!shopId) return next(new BadRequestError());

  const storedKeyToken = await KeyTokenService.findByShopId(shopId);
  if (!storedKeyToken) next(new ForbiddenError());

  if (req.headers[HEADER.REFRESH_TOKEN]) {
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN].toString();

    if (refreshToken !== storedKeyToken.refreshToken) {
      next(new ForbiddenError());
    }
    try {
      const publicKeyObject = await crypto.createPublicKey(storedKeyToken.publicKey);
      const payload = JWT.verify(refreshToken, publicKeyObject);
      if (payload.shopId !== shopId) return next(new ForbiddenError());

      req.shop = payload;
      req.storedKeyToken = storedKeyToken;
      req.refreshToken = refreshToken;

      return next();
    } catch (error) {
      next(new ForbiddenError());
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();
  if (!accessToken) return next(new BadRequestError());

  try {
    const publicKeyObject = await crypto.createPublicKey(storedKeyToken.publicKey);
    const payload = JWT.verify(accessToken, publicKeyObject);
    if (payload.shopId !== shopId) return next(new ForbiddenError());

    req.shop = payload;
    req.storedKeyToken = storedKeyToken;

    return next();
  } catch (error) {
    next(new ForbiddenError(5));
  }
});

module.exports = {
  apiKey,
  permission,
  authentication,
};
