// server/src/constants/paymentStatus.js
const PAYMENT_METHODS = Object.freeze({
  COD: 'COD',
  MOMO: 'MOMO',
});

const PAYMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
});

const PAYMENT_TX_STATUS = Object.freeze({
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
});

module.exports = {
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  PAYMENT_TX_STATUS,
};
