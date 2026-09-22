const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379/0'
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

async function connectRedis() {
  if (process.env.NODE_ENV === 'test') return;
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      console.log('✅ Connected to Redis successfully');
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
    }
  }
}

module.exports = { redisClient, connectRedis };
