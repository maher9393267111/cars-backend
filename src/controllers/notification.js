const Notifications = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const skip = parseInt(limit) * (parseInt(page) - 1) || 0;
    const totalNotifications = await Notifications.countDocuments();
    const totalUnreadNotifications = await Notifications.countDocuments({
      opened: false,
    });
    const notifications = await Notifications.find({}, null, {
      skip: skip,
      limit: parseInt(limit),
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: notifications,
      totalNotifications: totalNotifications,
      totalUnread: totalUnreadNotifications,
      count: Math.ceil(totalUnreadNotifications / parseInt(limit)),
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const { ...data } = req.body;
    // Create a new notification
    const newNotification = await Notifications.create({
      ...data,
    });

    return res.status(201).json({
      success: true,
      data: newNotification,
      message: "Notification Added",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotification = await Notifications.findByIdAndDelete(id);
    
    if (!deletedNotification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const markNotificationAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    const { opened } = req.body;
    const updatedNotification = await Notifications.findByIdAndUpdate(id, { opened }, { new: true });
    
    if (!updatedNotification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    res.status(200).json({ success: true, message: 'Notification updated successfully', data: updatedNotification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getNotifications, 
  createNotification, 
  markNotificationAsSeen, 
  deleteNotification 
};