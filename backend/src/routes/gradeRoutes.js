const express = require('express');
const router = express.Router();
const {
  getGrades,
  getGradeById,
  createGrade,
  updateGrade,
  deleteGrade,
  getGradeStats
} = require('../controllers/gradeController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getGrades)
  .post(createGrade);

router.route('/stats')
  .get(getGradeStats);

router.route('/:id')
  .get(getGradeById)
  .put(updateGrade)
  .delete(deleteGrade);

module.exports = router;