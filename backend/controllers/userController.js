const { User, ActivityLog } = require('../models');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      message: 'Users retrieved successfully',
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent deleting oneself
    if (userId === req.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

      // Log admin action
      await ActivityLog.create({
        userId: req.userId,
        action: 'User Deleted',
        details: `Deleted user ${user.username} (${user._id})`,
      });

      res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

// Update user status (Admin only)
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log admin action
    await ActivityLog.create({
      userId: req.userId,
      action: 'User Status Updated',
      details: `Changed status for ${user.username} (${user._id}) to ${status}`,
      taskId: null,
    });

    res.json({
      message: 'User status updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user status', error: error.message });
  }
};

// Update user role (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['Admin', 'User'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log admin action
    await ActivityLog.create({
      userId: req.userId,
      action: 'User Role Updated',
      details: `Changed role for ${user.username} (${user._id}) to ${role}`,
    });

    res.json({
      message: 'User role updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  updateUserRole,
};
