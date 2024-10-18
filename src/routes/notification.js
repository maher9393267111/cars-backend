const express = require('express');
const router = express.Router();
const notificationRoutes = require('../controllers/notification');
// Import verifyToken function
const verifyToken = require('../config/jwt');

// Admin routes
router.get('/admin/notifications', notificationRoutes.getNotifications);
router.post('/admin/notifications', verifyToken, notificationRoutes.createNotification);
router.delete('/admin/notifications/:id', verifyToken, notificationRoutes.deleteNotification);
router.put('/admin/notifications/:id', verifyToken, notificationRoutes.markNotificationAsSeen);

module.exports = router;