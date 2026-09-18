const request = require('supertest');
const app = require('../app');
const sequelize = require('../db');
const Order = require('../models/Order');

jest.mock('../middleware/auth', () => {
  return {
    authenticate: (req, res, next) => {
      req.user = { user_id: 'user_123', role: 'customer' };
      next();
    },
    isAdmin: (req, res, next) => {
      next();
    }
  };
});
jest.mock('axios');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Order Service Integration Tests', () => {
  beforeEach(async () => {
    await Order.destroy({ where: {} });
  });

  it('should return health check ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('ok');
  });

  it('should create a new order', async () => {
    const orderData = {
      items: [{ product_id: 'prod_1', name: 'Shoes', price: 50, quantity: 2 }],
      shipping_address: {
        full_name: 'John Doe',
        address_line1: '123 Main St',
        city: 'Anytown',
        state: 'NY',
        zip_code: '12345',
        country: 'US'
      },
      payment_id: 'pay_123',
      notes: 'Please leave at door'
    };

    const res = await request(app)
      .post('/api/orders')
      .send(orderData);
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.user_id).toEqual('user_123');
    expect(res.body.total_amount).toEqual(100);
    expect(res.body.status).toEqual('pending');
  });

  it('should fetch user orders', async () => {
    await Order.create({
      user_id: 'user_123',
      items: [{ product_id: 'prod_1', name: 'Shoes', price: 50, quantity: 2 }],
      shipping_address: {
        full_name: 'John Doe',
        address_line1: '123 Main St',
        city: 'Anytown',
        state: 'NY',
        zip_code: '12345',
        country: 'US'
      },
      total_amount: 100
    });

    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toEqual(200);
    expect(res.body.orders.length).toEqual(1);
    expect(res.body.orders[0].total_amount).toEqual(100);
  });
});
