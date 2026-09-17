const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// POST /send -> sendNotification
router.post('/send', notificationController.sendNotification);

// GET /user/:userId -> getUserNotifications
router.get('/user/:userId', notificationController.getUserNotifications);

// GET /unread/:userId -> getUnreadCount
router.get('/unread/:userId', notificationController.getUnreadCount);

// PUT /:id/read -> markAsRead
router.put('/:id/read', notificationController.markAsRead);

// PUT /read-all/:userId -> markAllAsRead
router.put('/read-all/:userId', notificationController.markAllAsRead);

// DELETE /:id -> deleteNotification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
