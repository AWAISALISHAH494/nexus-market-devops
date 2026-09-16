const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/status', authenticate, isAdmin, updateOrderStatus);
router.delete('/:id', authenticate, cancelOrder);

module.exports = router;
