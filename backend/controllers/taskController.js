const { Task, ActivityLog } = require('../models');

// Create task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      createdBy: req.userId,
      assignedTo,
      status: 'Pending',
    });

    await task.save();

    // Log activity
    await ActivityLog.create({
      userId: req.userId,
      action: 'Task Created',
      taskId: task._id,
      details: `Task created: ${title}`,
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

// Get user's tasks
const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.userId })
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email');

    res.json({
      message: 'Tasks retrieved successfully',
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve tasks', error: error.message });
  }
};

// Get all tasks (Admin only)
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email');

    res.json({
      message: 'All tasks retrieved successfully',
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve tasks', error: error.message });
  }
};

// Get tasks for a specific user (Admin only)
const getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ $or: [{ createdBy: userId }, { assignedTo: userId }] })
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email');

    res.json({ message: 'User tasks retrieved successfully', count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user tasks', error: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, dueDate, priority, assignedTo } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    if (task.createdBy.toString() !== req.userId && req.userRole !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;
    if (assignedTo) task.assignedTo = assignedTo;

    await task.save();

    // Log activity
    await ActivityLog.create({
      userId: req.userId,
      action: 'Task Updated',
      taskId: task._id,
      details: `Task updated: ${title || task.title}`,
    });

    res.json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    if (task.createdBy.toString() !== req.userId && req.userRole !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(taskId);

    // Log activity
    await ActivityLog.create({
      userId: req.userId,
      action: 'Task Deleted',
      taskId: taskId,
      details: `Task deleted: ${task.title}`,
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};

module.exports = {
  createTask,
  getUserTasks,
  getAllTasks,
  updateTask,
  deleteTask,
  getTasksByUser,
};
