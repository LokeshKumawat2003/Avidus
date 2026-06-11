const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: ['Login', 'User Deleted', 'User Status Updated', 'User Role Updated', 'Task Created', 'Task Updated', 'Task Deleted'],
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
    details: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
