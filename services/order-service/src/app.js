const express = require('express');
const { Sequelize } = require('sequelize');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const sequelize = require('./db');

sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL (order-service)');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Models synchronized');
  })
  .catch(err => {
    console.error('PostgreSQL connection error:', err);
  });

app.use('/api/orders', orderRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'order-service' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Order service listening on port ${PORT}`);
});

module.exports = app;
