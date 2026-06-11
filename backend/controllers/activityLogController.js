const { ActivityLog } = require('../models');

// Admin: get activity logs with optional filters
const getActivityLogs = async (req, res) => {
  try {
    const { userId, action } = req.query;
    const limit = parseInt(req.query.limit) || 100;
    const skip = parseInt(req.query.skip) || 0;

    const query = {};
    if (userId) query.userId = userId;
    if (action) query.action = action;

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('userId', 'username email')
        .populate('taskId', 'title')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      ActivityLog.countDocuments(query),
    ]);

    res.json({ message: 'Activity logs retrieved successfully', total, count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve logs', error: error.message });
  }
};

// Get current user's activity logs
const getUserActivityLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const logs = await ActivityLog.find({ userId: req.userId })
      .populate('taskId', 'title')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    res.json({ message: 'Your activity logs retrieved successfully', count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve logs', error: error.message });
  }
};

module.exports = {
  getActivityLogs,
  getUserActivityLogs,
};
