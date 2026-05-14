const express = require('express');
const router = express.Router();
const { getMe, updateMe, getAllUsers, getUserById, updateUser, deleteUser, validateUpdate } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// Authenticated user routes
router.get('/me', protect, getMe);
router.put('/me', protect, validateUpdate, updateMe);

// Admin-only routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.put('/:id', protect, authorize('admin'), validateUpdate, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
