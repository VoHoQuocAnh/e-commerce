// server/tests/integration/order.test.js
require('../setup');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const models = require('../../src/models');
const orderService = require('../../src/services/order.service');

describe('Integration Test: Order & Checkout API (/api/v1/orders)', () => {
  const validUserToken = jwt.sign(
    { sub: 2, role: 'user' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  beforeEach(() => {
    jest.spyOn(models.User, 'findByPk').mockResolvedValue({
      id: 2,
      fullName: 'Nguyễn Minh Khôi',
      email: 'khachhang@calemstudio.vn',
      role: 'user',
      isActive: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('POST /api/v1/orders chặn truy cập 401 khi không gửi kèm JWT Bearer Token', async () => {
    const res = await request(app).post('/api/v1/orders').send({
      paymentMethod: 'COD',
    });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/v1/orders tạo đơn hàng COD thành công khi dữ liệu hợp lệ', async () => {
    const mockOrderResponse = {
      order: {
        id: 101,
        orderCode: 'CLM-261110-XYZ1',
        totalAmount: 420000,
        paymentMethod: 'COD',
        orderStatus: 'pending_confirmation',
      },
      payUrl: null,
    };

    jest.spyOn(orderService, 'createOrder').mockResolvedValue(mockOrderResponse);

    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${validUserToken}`)
      .send({
        recipientName: 'Nguyễn Minh Khôi',
        recipientPhone: '0987654321',
        shippingAddress: '120 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        paymentMethod: 'COD',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.order.orderCode).toBe('CLM-261110-XYZ1');
    expect(res.body.data.order.orderStatus).toBe('pending_confirmation');
  });
});
