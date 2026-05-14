const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const {
  validateEvent,
  createEvent,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getAllEvents,
} = require('../controllers/eventController');

router.post('/', protect, validateEvent, createEvent);
router.get('/', protect, getMyEvents);
router.get('/all', protect, authorize('admin'), getAllEvents);
router.get('/:id', protect, getEventById);
router.put('/:id', protect, validateEvent, updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;
