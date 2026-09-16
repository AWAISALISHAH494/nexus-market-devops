const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product_id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user_id: { type: String, required: true, index: true },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: [v => v && v.length > 0, 'Order must contain at least 1 item']
  },
  shipping_address: {
    full_name: { type: String, required: true },
    address_line1: { type: String, required: true },
    address_line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip_code: { type: String, required: true },
    country: { type: String, required: true, default: 'US' },
    phone: { type: String }
  },
  total_amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  payment_id: { type: String },
  tracking_number: { type: String },
  notes: { type: String }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

orderSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

orderSchema.index({ user_id: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
