// server/src/config/momo.js
const env = require('./environment');

module.exports = {
  partnerCode: env.MOMO_PARTNER_CODE,
  accessKey: env.MOMO_ACCESS_KEY,
  secretKey: env.MOMO_SECRET_KEY,
  endpoint: env.MOMO_ENDPOINT,
  redirectUrl: env.MOMO_REDIRECT_URL,
  ipnUrl: env.MOMO_IPN_URL,
  requestType: 'payWithMethod',
  lang: 'vi',
};
