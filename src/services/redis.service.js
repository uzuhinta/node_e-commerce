const { promisify } = require('util');
const { reservationInventory } = require('#src/models/repositories/inventory.repository.js');
const { getClients } = require('../configs/redis.config');
const { cacheInstance: redisClient } = getClients();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);

const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

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
