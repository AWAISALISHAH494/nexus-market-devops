const Notification = require('../models/Notification');
const emailService = require('../services/emailService');

const sendNotification = async (req, res, next) => {
  try {
    const { user_id, type, title, message, data, send_email, email_to } = req.body;

    let email_sent = false;

    if (send_email && email_to) {
      let emailContent = null;
      switch (type) {
        case 'welcome':
          emailContent = emailService.getWelcomeEmail(data?.username || 'User');
          break;
        case 'order_confirmation':
          emailContent = emailService.getOrderConfirmationEmail(data);
          break;
        case 'payment_success':
          emailContent = emailService.getPaymentSuccessEmail(data);
          break;
        case 'order_status_update':
        case 'shipping_update':
          emailContent = emailService.getOrderStatusEmail(data, data?.status || type);
          break;
        default:
          emailContent = {
            subject: title,
            html: `<p>${message}</p>`
          };
      }

      if (emailContent) {
        email_sent = await emailService.sendEmail(email_to, emailContent.subject, emailContent.html);
      }
    }

    const notification = await Notification.create({
      user_id,
      type,
      title,
      message,
      data,
      email_sent
    });

    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};

const getUserNotifications = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        offset: skip,
        limit: limit
      }),
      Notification.count({ where: { user_id: userId } })
    ]);

    res.json({
      data: notifications,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Notification.update(
      { is_read: true },
      { where: { id: id } }
    );
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const [updatedCount] = await Notification.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } }
    );

    res.json({
      success: true,
      updated_count: updatedCount
    });
  } catch (error) {
    next(error);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const count = await Notification.count({ where: { user_id: userId, is_read: false } });
    res.json({ count });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Notification.destroy({ where: { id: id } });
    
    if (!result) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
};
