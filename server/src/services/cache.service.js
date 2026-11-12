// server/src/services/cache.service.js
const redisClient = require('../config/redis');
const logger = require('../utils/logger');

const DEFAULT_TTL = 300; // 5 minutes

const ensureConnected = async () => {
  if (redisClient.status === 'wait') {
    await redisClient.connect();
  }
};

const get = async (key) => {
  try {
    await ensureConnected();
    const raw = await redisClient.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    logger.debug(`Redis GET skipped (${key}): ${err.message}`);
    return null;
  }
};

const set = async (key, value, ttlSeconds = DEFAULT_TTL) => {
  try {
    await ensureConnected();
    await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (err) {
    logger.debug(`Redis SET skipped (${key}): ${err.message}`);
  }
};

const del = async (key) => {
  try {
    await ensureConnected();
    await redisClient.del(key);
  } catch (err) {
    logger.debug(`Redis DEL skipped (${key}): ${err.message}`);
  }
};

const delByPattern = async (pattern) => {
  try {
    await ensureConnected();
    let cursor = '0';
    do {
      const [nextCursor, keys] = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    } while (cursor !== '0');
  } catch (err) {
    logger.debug(`Redis DEL pattern skipped (${pattern}): ${err.message}`);
  }
};

module.exports = {
  get,
  set,
  del,
  delByPattern,
};
