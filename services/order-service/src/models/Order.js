const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      hasItems(value) {
        if (!value || value.length === 0) {
          throw new Error('Order must contain at least 1 item');
        }
      }
    }
  },
  shipping_address: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  },
  payment_id: {
    type: DataTypes.STRING,
  },
  tracking_number: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.TEXT,
  }
}, {
  tableName: 'orders',
  timestamps: true,
});

module.exports = Order;
