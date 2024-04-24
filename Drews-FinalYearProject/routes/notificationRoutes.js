const express = require('express');
const Notification = require('../models/notificationModel');
const { isAuthenticated } = require('./middleware/authMiddleware');
const router = express.Router();

// Fetch notifications for a user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.session.userId }).sort({ createdAt: -1 });
    console.log('Fetched notifications for user:', req.session.userId);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send({ message: 'Error fetching notifications', error: error.message });
  }
});

// Mark a notification as read
router.post('/markAsRead/:id', isAuthenticated, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    console.log('Notification marked as read:', req.params.id);
    res.send({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).send({ message: 'Error marking notification as read', error: error.message });
  }
});

module.exports = router;