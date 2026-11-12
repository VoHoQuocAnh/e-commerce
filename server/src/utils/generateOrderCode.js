// server/src/utils/generateOrderCode.js
const crypto = require('crypto');

const generateOrderCode = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `CLM-${y}${m}${d}-${rand}`;
};

module.exports = generateOrderCode;
