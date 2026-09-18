const request = require('supertest');
const app = require('../app');
const sequelize = require('../db');
const Notification = require('../models/Notification');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Notification Service Integration Tests', () => {
  beforeEach(async () => {
    await Notification.destroy({ where: {} });
  });

  it('should return health check ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
  });

  it('should create a notification', async () => {
    const data = {
      user_id: 'user_123',
      type: 'order_confirmation',
      title: 'Order Received',
      message: 'Your order was received successfully.',
      send_email: false
    };

    const res = await request(app)
      .post('/api/notifications/send')
      .send(data);
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.user_id).toEqual('user_123');
    expect(res.body.title).toEqual('Order Received');
    expect(res.body.is_read).toBe(false);
  });

  it('should fetch user notifications and mark as read', async () => {
    const n = await Notification.create({
      user_id: 'user_123',
      title: 'Hello',
      message: 'Test Message',
      type: 'general'
    });

    const res = await request(app).get('/api/notifications/user/user_123');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toEqual(1);
    expect(res.body.data[0].is_read).toBe(false);

    const markRes = await request(app).put(`/api/notifications/${n.id}/read`);
    expect(markRes.statusCode).toEqual(200);
    expect(markRes.body.is_read).toBe(true);
  });
});
