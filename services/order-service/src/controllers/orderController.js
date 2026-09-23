const Order = require('../models/Order');
const axios = require('axios');

const createOrder = async (req, res) => {
  try {
    const { items, shipping_address, payment_id, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least 1 item' });
    }

    if (!shipping_address || !shipping_address.full_name || !shipping_address.address_line1 || !shipping_address.city || !shipping_address.state || !shipping_address.zip_code) {
      return res.status(400).json({ error: 'Incomplete shipping address' });
    }

    const total_amount = items.reduce((sum, item) => {
      if (!item.price || !item.quantity) return sum;
      return sum + (item.price * item.quantity);
    }, 0);

    const order = await Order.create({
      user_id: String(req.user.user_id),
      items,
      shipping_address,
      total_amount,
      payment_id,
      notes
    });

    // Fire-and-forget notification
    if (process.env.NOTIFICATION_SERVICE_URL) {
      axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/notify`, {
        event: 'ORDER_CREATED',
        order_id: order.id,
        user_id: order.user_id
      }).catch(err => {
        console.error('Failed to send notification:', err.message);
      });
    }

    return res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { user_id: String(req.user.user_id) };

    const [orders, total] = await Promise.all([
      Order.findAll({ 
        where: query, 
        order: [['createdAt', 'DESC']], 
        offset: skip, 
        limit: limit 
      }),
      Order.count({ where: query })
    ]);

    const pages = Math.ceil(total / limit);

    return res.status(200).json({
      orders,
      meta: {
        total,
        page,
        pages,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.user_id !== String(req.user.user_id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to access this order' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    // Fire-and-forget notification
    if (process.env.NOTIFICATION_SERVICE_URL) {
      axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/notify`, {
        event: 'ORDER_STATUS_UPDATED',
        order_id: order.id,
        user_id: order.user_id,
        status: order.status
      }).catch(err => {
        console.error('Failed to send status update notification:', err.message);
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.user_id !== String(req.user.user_id)) {
      return res.status(403).json({ error: 'Unauthorized to cancel this order' });
    }

    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({ error: 'Order cannot be cancelled in its current status' });
    }

    order.status = 'cancelled';
    await order.save();

    return res.status(200).json(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};
