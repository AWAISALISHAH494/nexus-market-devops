const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(cors());

// IMPORTANT: Webhook route needs raw body parser BEFORE express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to PostgreSQL
sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL (payment-service)');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Models synchronized');
  })
  .catch(err => {
    console.error('PostgreSQL connection error:', err);
  });

// Routes
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'payment-service' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3004;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Payment service listening on port ${PORT}`);
  });
}

module.exports = app;
