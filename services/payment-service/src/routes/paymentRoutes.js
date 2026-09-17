const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

router.post('/process', authenticate, paymentController.processPayment);
router.get('/user', authenticate, paymentController.getUserPayments);
router.get('/order/:orderId', authenticate, paymentController.getPaymentByOrder);
router.get('/:id', authenticate, paymentController.getPaymentById);
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
