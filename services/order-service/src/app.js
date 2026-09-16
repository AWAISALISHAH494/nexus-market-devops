const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/orders';

mongoose.connect(mongoURI);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
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
