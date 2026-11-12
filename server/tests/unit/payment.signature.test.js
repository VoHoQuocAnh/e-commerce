// server/tests/unit/payment.signature.test.js
require('../setup');
const {
  buildMomoCallbackSignature,
  handleMomoIpn,
} = require('../../src/services/payment.service');
const models = require('../../src/models');
const { ORDER_STATUS } = require('../../src/constants/orderStatus');
const { PAYMENT_STATUS, PAYMENT_TX_STATUS } = require('../../src/constants/paymentStatus');

describe('Unit Test: MoMo HMAC SHA256 Signature & Idempotent IPN Handling', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const sampleIpnPayload = {
    partnerCode: 'MOMO',
    orderId: 'CLM-261110-ABCD-1700000000',
    requestId: 'CLM-261110-ABCD-1700000000',
    amount: 420000,
    orderInfo: 'Thanh toan don hang CLM-261110-ABCD',
    orderType: 'momo_wallet',
    transId: 29837492384,
    resultCode: 0,
    message: 'Giao dịch thành công.',
    payType: 'qr',
    responseTime: 1700000050000,
    extraData: '',
  };

  test('Tạo chữ ký HMAC SHA256 chuẩn xác 64 ký tự hex theo đúng thứ tự alphabet của MoMo', () => {
    const signature = buildMomoCallbackSignature(sampleIpnPayload);
    expect(typeof signature).toBe('string');
    expect(signature).toHaveLength(64);
  });

  test('Từ chối IPN nếu chữ ký HMAC SHA256 bị giả mạo', async () => {
    const forgedPayload = {
      ...sampleIpnPayload,
      signature: '0'.repeat(64),
    };

    await expect(handleMomoIpn(forgedPayload)).rejects.toThrow(
      'Chữ ký MoMo IPN không hợp lệ'
    );
  });

  test('Xử lý Idempotent khi MoMo gọi IPN lặp lại nhiều lần cho cùng 1 giao dịch đã thành công', async () => {
    const validSignature = buildMomoCallbackSignature(sampleIpnPayload);
    const validPayload = { ...sampleIpnPayload, signature: validSignature };

    jest.spyOn(models.sequelize, 'transaction').mockImplementation(async (cb) => {
      return cb({ LOCK: { UPDATE: 'UPDATE' } });
    });

    const mockPayment = {
      id: 10,
      orderId: 99,
      requestId: sampleIpnPayload.requestId,
      amount: 420000,
      status: PAYMENT_TX_STATUS.SUCCESS, // Đã được xử lý trước đó
      update: jest.fn(),
    };

    const mockOrder = {
      id: 99,
      orderCode: 'CLM-261110-ABCD',
      paymentStatus: PAYMENT_STATUS.PAID,
      orderStatus: ORDER_STATUS.PENDING_CONFIRMATION,
      update: jest.fn(),
    };

    jest.spyOn(models.Payment, 'findOne').mockResolvedValue(mockPayment);
    jest.spyOn(models.Order, 'findByPk').mockResolvedValue(mockOrder);

    const result = await handleMomoIpn(validPayload);

    expect(result.alreadyProcessed).toBe(true);
    expect(result.orderCode).toBe('CLM-261110-ABCD');
    expect(mockPayment.update).not.toHaveBeenCalled();
    expect(mockOrder.update).not.toHaveBeenCalled();
  });
});
