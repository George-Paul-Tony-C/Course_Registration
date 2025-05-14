const prisma = require('../../config/prismaClient');

// Create a notification
exports.createNotification = async (req, res) => {
  const { recipient_id, message } = req.body;

  try {
    const newNotification = await prisma.notification.create({
      data: {
        recipient_id,
        message,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: newNotification,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message,
    });
  }
};

// Get all notifications for a faculty member
exports.getNotifications = async (req, res) => {
  const facultyId = req.user.id;

  try {
    const notifications = await prisma.notification.findMany({
      where: { recipient_id: facultyId },
    });

    return res.status(200).json({
      success: true,
      message: 'Notifications fetched successfully',
      data: notifications,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedNotification = await prisma.notification.update({
      where: { id: parseInt(id, 10) },
      data: { is_read: true },
    });

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: updatedNotification,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message,
    });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    await prisma.notification.delete({
      where: { id: parseInt(id, 10) },
    });

    return res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message,
    });
  }
};
