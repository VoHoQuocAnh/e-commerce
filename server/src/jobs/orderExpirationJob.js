// server/src/jobs/orderExpirationJob.js
const cron = require('node-cron');
const orderService = require('../services/order.service');
const logger = require('../utils/logger');

let task = null;

const startOrderExpirationJob = () => {
  if (task) return task;

  // Run every minute to check expired MoMo pending_payment orders
  task = cron.schedule('* * * * *', async () => {
    try {
      await orderService.cancelExpiredOrders();
    } catch (error) {
      logger.error('[OrderExpirationJob] Error:', error);
    }
  });

  logger.info('[OrderExpirationJob] Scheduled (every 1 minute)');
  return task;
};

const stopOrderExpirationJob = () => {
  if (task) {
    task.stop();
    task = null;
  }
};

module.exports = {
  startOrderExpirationJob,
  stopOrderExpirationJob,
};
