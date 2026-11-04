
const nodemailer = require('nodemailer');
const escapeHtml = require('escape-html');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM = '"Nexus Market" <noreply@nexusmarket.com>'
} = process.env;

let transporter = null;

if (SMTP_HOST && SMTP_PORT) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: SMTP_PORT == 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
} else {
  console.warn('SMTP configuration is missing. Emails will not be sent.');
}

const sendEmail = async (to, subject, html) => {
  if (!transporter) {
    console.warn('sendEmail called but transporter is not configured. Email to', to, 'skipped.');
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html
    });

    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email to', to, ':', error);
    return false;
  }
};

const getWelcomeEmail = (username) => {
  const safeUsername = escapeHtml(String(username || 'User'));

  const subject = 'Welcome to Nexus Market!';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #6C63FF; border-bottom: 2px solid #6C63FF; padding-bottom: 10px;">Nexus Market</h2>
      <h3>Hello ${escapeHtml(String(username || 'User'))},</h3>
      <p>Welcome to Nexus Market! We are thrilled to have you on board.</p>
      <p>Discover a wide range of products and enjoy seamless shopping experiences with us.</p>
      <p style="margin-top: 30px;">Best regards,<br/>The Nexus Market Team</p>
    </div>
  `;

  return { subject, html };
};

const getOrderConfirmationEmail = (orderData = {}) => {
  const safeOrderId = escapeHtml(String(orderData.order_id ?? 'N/A'));
  const safeAmount = escapeHtml(String(orderData.total_amount ?? '0'));

  const subject = 'Order Confirmation - Nexus Market';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #6C63FF; border-bottom: 2px solid #6C63FF; padding-bottom: 10px;">Nexus Market</h2>
      <h3>Order Confirmation</h3>
      <p>Thank you for your order, we're getting it ready!</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
        <p><strong>Order ID:</strong> ${safeOrderId}</p>
        <p><strong>Total Amount:</strong> $${safeAmount}</p>
      </div>
      <p style="margin-top: 30px;">Best regards,<br/>The Nexus Market Team</p>
    </div>
  `;

  return { subject, html };
};

const getPaymentSuccessEmail = (paymentData = {}) => {
  const safeOrderId = escapeHtml(String(paymentData.order_id ?? 'N/A'));
  const safeAmount = escapeHtml(String(paymentData.amount ?? '0'));
  const safeMethod = escapeHtml(String(paymentData.method || 'Card'));

  const subject = 'Payment Successful - Nexus Market';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #6C63FF; border-bottom: 2px solid #6C63FF; padding-bottom: 10px;">Nexus Market</h2>
      <h3>Payment Successful</h3>
      <p>Your payment for order <strong>${safeOrderId}</strong> was successfully processed.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
        <p><strong>Amount Paid:</strong> $${safeAmount}</p>
        <p><strong>Payment Method:</strong> ${safeMethod}</p>
      </div>
      <p style="margin-top: 30px;">Best regards,<br/>The Nexus Market Team</p>
    </div>
  `;

  return { subject, html };
};

const getOrderStatusEmail = (orderData = {}, newStatus) => {
  const safeOrderId = escapeHtml(String(orderData.order_id ?? 'N/A'));
  const safeStatus = escapeHtml(String(newStatus || 'Updated'));

  const subject = 'Order Status Update - Nexus Market';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #6C63FF; border-bottom: 2px solid #6C63FF; padding-bottom: 10px;">Nexus Market</h2>
      <h3>Order Status Update</h3>
      <p>The status of your order <strong>${safeOrderId}</strong> has been updated.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
        <p><strong>New Status:</strong> <span style="color: #6C63FF; font-weight: bold; text-transform: capitalize;">${safeStatus}</span></p>
      </div>
      <p style="margin-top: 30px;">Best regards,<br/>The Nexus Market Team</p>
    </div>
  `;

  return { subject, html };
};

module.exports = {
  sendEmail,
  getWelcomeEmail,
  getOrderConfirmationEmail,
  getPaymentSuccessEmail,
  getOrderStatusEmail
};
