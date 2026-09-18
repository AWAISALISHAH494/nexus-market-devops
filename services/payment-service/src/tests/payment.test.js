const request = require('supertest');
const app = require('../app');
const sequelize = require('../db');
const Payment = require('../models/Payment');

jest.mock('../middleware/auth', () => {
  return {
    authenticate: (req, res, next) => {
      req.user = { user_id: 'user_123', role: 'customer' };
      next();
    }
  };
});
jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} })
}));

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Payment Service Integration Tests', () => {
  beforeEach(async () => {
    await Payment.destroy({ where: {} });
  });

  it('should return health check ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
  });

  it('should process a new payment', async () => {
    const paymentData = {
      order_id: 'order_123',
      amount: 100,
      currency: 'usd',
      method: 'mock'
    };

    const res = await request(app)
      .post('/api/payments/process')
      .send(paymentData);
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.user_id).toEqual('user_123');
    expect(res.body.amount).toEqual(100);
    expect(res.body.status).toEqual('completed'); // mock method auto-completes
  });

  it('should fetch user payments', async () => {
    await Payment.create({
      order_id: 'order_123',
      user_id: 'user_123',
      amount: 100,
      status: 'completed'
    });

    const res = await request(app).get('/api/payments/user');
    expect(res.statusCode).toEqual(200);
    expect(res.body.payments.length).toEqual(1);
    expect(res.body.payments[0].amount).toEqual(100);
  });
});
