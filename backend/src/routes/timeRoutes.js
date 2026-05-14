const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const {
  validateTimeEntry,
  startTimer,
  stopTimer,
  createManualEntry,
  getMyTimeEntries,
  getActiveTimer,
  updateTimeEntry,
  deleteTimeEntry,
  getTimeSummary,
  getAllTimeEntries,
} = require('../controllers/timeEntryController');

router.post('/', protect, startTimer);
router.post('/manual', protect, validateTimeEntry, createManualEntry);
router.get('/', protect, getMyTimeEntries);
router.get('/active', protect, getActiveTimer);
router.get('/summary', protect, getTimeSummary);
router.get('/all', protect, authorize('admin'), getAllTimeEntries);
router.put('/:id/stop', protect, stopTimer);
router.put('/:id', protect, validateTimeEntry, updateTimeEntry);
router.delete('/:id', protect, deleteTimeEntry);

module.exports = router;
