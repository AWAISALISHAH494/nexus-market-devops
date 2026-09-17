const Payment = require('../models/Payment');
const axios = require('axios');
let stripe;

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://order-service:3002/api/orders';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3004/api/notifications';

exports.processPayment = async (req, res) => {
  try {
    const { order_id, amount, currency = 'usd', method = 'mock', card_details, metadata } = req.body;
    
    if (!order_id || amount === undefined) {
      return res.status(400).json({ message: 'order_id and amount are required' });
    }

    const payment = await Payment.create({
      order_id,
      user_id: req.user.user_id || req.user.id,
      amount,
      currency,
      method,
      status: 'processing',
      metadata
    });

    let finalMethod = method;

    if (method === 'card' && process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_stripe_key') {
      try {
        if (!stripe) {
          stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        }
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // assuming amount in major units
          currency,
          metadata: { order_id: payment.order_id.toString() }
        });

        payment.stripe_payment_id = paymentIntent.id;
        payment.status = 'pending';
      } catch (stripeErr) {
        console.error('Stripe error:', stripeErr.message);
        finalMethod = 'mock'; // Fallback
      }
    }

    if (finalMethod === 'mock' || method === 'mock') {
      payment.status = 'completed';
      payment.card_last_four = '4242';
      payment.card_brand = 'visa';
      payment.method = 'mock';
    }

    await payment.save();

    if (payment.status === 'completed') {
      // Notify order service (fire-and-forget)
      axios.put(`${ORDER_SERVICE_URL}/${order_id}/status`, {
        status: 'confirmed',
        payment_id: payment.id
      }, {
        headers: { Authorization: req.headers.authorization }
      }).catch(err => console.error('Failed to notify order service:', err.message));

      // Notify notification service (fire-and-forget)
      axios.post(NOTIFICATION_SERVICE_URL, {
        user_id: payment.user_id,
        type: 'payment_success',
        message: `Payment of ${amount} ${currency} for order ${order_id} was successful.`
      }).catch(err => console.error('Failed to notify notification service:', err.message));
    }

    return res.status(201).json(payment);
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const userId = req.user.user_id || req.user.id;
    if (payment.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json(payment);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching payment', error: error.message });
  }
};

exports.getPaymentByOrder = async (req, res) => {
  try {
    const payment = await Payment.findOne({ where: { order_id: req.params.orderId } });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const userId = req.user.user_id || req.user.id;
    if (payment.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json(payment);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching payment', error: error.message });
  }
};

exports.getUserPayments = async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const payments = await Payment.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit
    });

    const total = await Payment.count({ where: { user_id: userId } });

    return res.json({
      payments,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const event = req.body;
    console.log('Webhook event received:', event.type);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      await Payment.update(
        { status: 'completed' },
        { where: { stripe_payment_id: paymentIntent.id } }
      );
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      console.log(`Payment failed: ${paymentIntent.last_payment_error?.message}`);
      await Payment.update(
        { 
          status: 'failed',
          failure_reason: paymentIntent.last_payment_error?.message
        },
        { where: { stripe_payment_id: paymentIntent.id } }
      );
    }

    return res.status(200).send({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
