const express = require('express');
const helmet = require('helmet');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const sequelize = require('./db');

sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL (notification-service)');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Models synchronized');
  })
  .catch(err => {
    console.error('PostgreSQL connection error:', err);
  });

const { connectRedis } = require('./redis');
connectRedis().catch(console.error);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'notification-service' });
});

// Routes
app.use('/api/notifications', notificationRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Start Server
const PORT = process.env.PORT || 3005;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Notification service listening on port ${PORT}`);
  });
}

module.exports = app;
