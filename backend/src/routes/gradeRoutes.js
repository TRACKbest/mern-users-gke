const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const {
  validateGrade,
  createGrade,
  getMyGrades,
  getGradeById,
  updateGrade,
  deleteGrade,
  getGradeStats,
  getAllGrades,
} = require('../controllers/gradeController');

router.post('/', protect, validateGrade, createGrade);
router.get('/', protect, getMyGrades);
router.get('/stats', protect, getGradeStats);
router.get('/all', protect, authorize('admin'), getAllGrades);
router.get('/:id', protect, getGradeById);
router.put('/:id', protect, validateGrade, updateGrade);
router.delete('/:id', protect, deleteGrade);

module.exports = router;