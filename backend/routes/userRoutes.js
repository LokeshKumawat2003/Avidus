const express = require('express');
const { getAllUsers, deleteUser, updateUserStatus, updateUserRole } = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Protected routes - Admin only
router.get('/all', auth, adminOnly, getAllUsers);
router.delete('/:userId', auth, adminOnly, deleteUser);
router.patch('/:userId/status', auth, adminOnly, updateUserStatus);
router.patch('/:userId/role', auth, adminOnly, updateUserRole);

module.exports = router;
