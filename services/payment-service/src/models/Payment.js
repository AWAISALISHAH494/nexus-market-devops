const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    }
  },
  currency: {
    type: DataTypes.ENUM('usd', 'eur', 'gbp'),
    defaultValue: 'usd',
  },
  method: {
    type: DataTypes.ENUM('card', 'mock'),
    defaultValue: 'mock',
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  stripe_payment_id: {
    type: DataTypes.STRING,
  },
  card_last_four: {
    type: DataTypes.STRING,
  },
  card_brand: {
    type: DataTypes.STRING,
  },
  failure_reason: {
    type: DataTypes.STRING,
  },
  metadata: {
    type: DataTypes.JSONB,
  }
}, {
  tableName: 'payments',
  timestamps: true,
});

module.exports = Payment;
