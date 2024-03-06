const redis = require('redis');
const { promisify } = require('util');
const redisClient = redis.createClient();
const { reservationInventory } = require('#src/models/repositories/inventory.repository.js');

const pexpire = promisify(redisClient.pExpire).bind(redisClient);

const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_${productId}`;
  const retryTime = 10;
  const expireTime = 3000;

  for (let i = 0; i < retryTime; i++) {
    const result = await setnxAsync(key, expireTime);
    if (result === 1) {
      const isReservation = await reservationInventory({ productId, quantity, cartId });
      if (isReservation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (key) => {
  const delKeyAsync = promisify(redisClient.del).bind(redisClient);
  return await delKeyAsync(key);
};

module.exports = {
  acquireLock,
  releaseLock,
};
