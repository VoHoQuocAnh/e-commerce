// server/src/config/redis.js
const Redis = require('ioredis');
const env = require('./environment');

const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 5) return null;
    return Math.min(times * 200, 2000);
  },
  lazyConnect: true,
});

redisClient.on('error', (err) => {
  if (env.NODE_ENV !== 'test') {
    console.warn('[Redis] Connection warning:', err.message);
  }
});

module.exports = redisClient;
