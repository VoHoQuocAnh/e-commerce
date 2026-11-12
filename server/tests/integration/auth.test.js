// server/tests/integration/auth.test.js
require('../setup');
const request = require('supertest');
const app = require('../../src/app');
const authService = require('../../src/services/auth.service');

describe('Integration Test: Auth API (/api/v1/auth)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('GET /api/v1/health trả về trạng thái 200 OK', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('OK');
  });

  test('POST /api/v1/auth/register trả về 422 khi dữ liệu đầu vào không hợp lệ (Zod validation)', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      fullName: 'A',
      email: 'not-an-email',
      password: '123',
    });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  test('POST /api/v1/auth/login trả về 200 kèm accessToken & refreshToken khi hợp lệ', async () => {
    const mockAuthResult = {
      user: {
        id: 1,
        fullName: 'Nguyễn Minh Khôi',
        email: 'khachhang@calemstudio.vn',
        role: 'user',
      },
      accessToken: 'mock.jwt.access.token',
      refreshToken: 'mock.jwt.refresh.token',
    };

    jest.spyOn(authService, 'login').mockResolvedValue(mockAuthResult);

    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'khachhang@calemstudio.vn',
      password: 'User@123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBe('mock.jwt.access.token');
    expect(res.body.data.user.email).toBe('khachhang@calemstudio.vn');
  });
});
