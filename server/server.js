// server/server.js
const env = require('./src/config/environment');
const app = require('./src/app');
const { sequelize } = require('./src/models');
const redisClient = require('./src/config/redis');
const logger = require('./src/utils/logger');
const {
  startOrderExpirationJob,
  stopOrderExpirationJob,
} = require('./src/jobs/orderExpirationJob');

let server;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('MySQL database connected successfully.');

    try {
      if (redisClient.status === 'wait') {
        await redisClient.connect();
      }
      logger.info('Redis connected successfully.');
    } catch (redisErr) {
      logger.warn(`Redis unavailable at startup, running without cache: ${redisErr.message}`);
    }

    startOrderExpirationJob();

    server = app.listen(env.PORT, () => {
      logger.info(`Server running on http://localhost:${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  stopOrderExpirationJob();

  if (server) {
    server.close(async () => {
      try {
        await sequelize.close();
        if (redisClient.status === 'ready') {
          await redisClient.quit();
        }
        logger.info('Database and Redis connections closed.');
        process.exit(0);
      } catch (err) {
        logger.error('Error during shutdown:', err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

startServer();
