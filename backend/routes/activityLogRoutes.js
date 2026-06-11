const express = require('express');
const { getActivityLogs, getUserActivityLogs } = require('../controllers/activityLogController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Admin only
router.get('/', auth, adminOnly, getActivityLogs);

// Protected
router.get('/user/my-logs', auth, getUserActivityLogs);

module.exports = router;
