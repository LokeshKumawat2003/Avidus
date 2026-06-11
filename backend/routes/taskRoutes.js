const express = require('express');
const { createTask, getUserTasks, getAllTasks, updateTask, deleteTask, getTasksByUser } = require('../controllers/taskController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.post('/', auth, createTask);
router.get('/my-tasks', auth, getUserTasks);
// Admin: tasks by user
router.get('/user/:userId', auth, adminOnly, getTasksByUser);
router.patch('/:taskId', auth, updateTask);
router.delete('/:taskId', auth, deleteTask);

// Admin only
router.get('/all-tasks', auth, adminOnly, getAllTasks);

module.exports = router;
