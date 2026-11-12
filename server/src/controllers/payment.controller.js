// server/src/controllers/payment.controller.js
const paymentService = require('../services/payment.service');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_CODES = require('../constants/httpCodes');

const createMomoPayment = async (req, res, next) => {
  try {
    const result = await paymentService.createMomoPaymentForOrder(req.body.orderId, req.user.id);
    return ApiResponse.success(res, { message: 'Tạo liên kết thanh toán MoMo thành công', data: result });
  } catch (err) {
    next(err);
  }
};

const handleMomoIpn = async (req, res, next) => {
  try {
    await paymentService.handleMomoIpn(req.body);
    return res.status(HTTP_CODES.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
};

const verifyMomoRedirect = async (req, res, next) => {
  try {
    const result = await paymentService.verifyMomoRedirect(req.query);
    return ApiResponse.success(res, {
      message: result.isSuccess ? 'Thanh toán MoMo thành công' : 'Thanh toán MoMo thất bại',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createMomoPayment,
  handleMomoIpn,
  verifyMomoRedirect,
};
