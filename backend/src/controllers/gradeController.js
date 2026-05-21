const { body, validationResult } = require('express-validator');
const Grade = require('../models/Grade');

const validateGrade = [
  body('subject').trim().notEmpty().withMessage('Le sujet est requis').isLength({ max: 100 }),
  body('grade').isFloat({ min: 0, max: 20 }).withMessage('La note doit être entre 0 et 20'),
  body('semester').isIn(['Semestre 1', 'Semestre 2', 'Semestre 3', 'Semestre 4', 'Semestre 5', 'Semestre 6']),
  body('academicYear').trim().notEmpty().withMessage("L'année académique est requise"),
  body('coefficient').optional().isInt({ min: 1 }),
  body('category').optional().isIn(['examen', 'devoir', 'projet', 'tp', 'partiel']),
];

const createGrade = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const grade = await Grade.create({
      ...req.body,
      student: req.user._id,
    });

    res.status(201).json({ success: true, data: grade });
  } catch (error) {
    next(error);
  }
};

const getMyGrades = async (req, res, next) => {
  try {
    const { semester, academicYear, subject, page = 1, limit = 50 } = req.query;

    const filter = { student: req.user._id };
    if (semester) filter.semester = semester;
    if (academicYear) filter.academicYear = academicYear;
    if (subject) filter.subject = { $regex: subject, $options: 'i' };

    const grades = await Grade.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Grade.countDocuments(filter);

    res.json({
      success: true,
      data: grades,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getGradeById = async (req, res, next) => {
  try {
    const grade = await Grade.findOne({ _id: req.params.id, student: req.user._id });
    if (!grade) {
      return res.status(404).json({ success: false, message: 'Note non trouvée' });
    }
    res.json({ success: true, data: grade });
  } catch (error) {
    next(error);
  }
};

const updateGrade = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const grade = await Grade.findOneAndUpdate(
      { _id: req.params.id, student: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!grade) {
      return res.status(404).json({ success: false, message: 'Note non trouvée' });
    }

    res.json({ success: true, data: grade });
  } catch (error) {
    next(error);
  }
};

const deleteGrade = async (req, res, next) => {
  try {
    const grade = await Grade.findOneAndDelete({ _id: req.params.id, student: req.user._id });
    if (!grade) {
      return res.status(404).json({ success: false, message: 'Note non trouvée' });
    }
    res.json({ success: true, message: 'Note supprimée' });
  } catch (error) {
    next(error);
  }
};

const getGradeStats = async (req, res, next) => {
  try {
    const { semester, academicYear } = req.query;

    const filter = { student: req.user._id };
    if (semester) filter.semester = semester;
    if (academicYear) filter.academicYear = academicYear;

    const grades = await Grade.find(filter);

    if (grades.length === 0) {
      return res.json({
        success: true,
        data: {
          average: 0,
          totalGrades: 0,
          subjects: [],
          semester: semester || 'Tous',
          academicYear: academicYear || 'Toutes',
        },
      });
    }

    const totalWeighted = grades.reduce((sum, grade) => sum + grade.grade * grade.coefficient, 0);
    const totalCoefficient = grades.reduce((sum, grade) => sum + grade.coefficient, 0);
    const average = totalWeighted / totalCoefficient;

    const subjectStats = {};
    grades.forEach(grade => {
      if (!subjectStats[grade.subject]) {
        subjectStats[grade.subject] = {
          grades: [],
          totalCoefficient: 0,
        };
      }
      subjectStats[grade.subject].grades.push(grade.grade);
      subjectStats[grade.subject].totalCoefficient += grade.coefficient;
    });

    const subjects = Object.keys(subjectStats).map(subject => ({
      name: subject,
      average: subjectStats[subject].grades.reduce((a, b) => a + b, 0) / subjectStats[subject].grades.length,
      count: subjectStats[subject].grades.length,
    }));

    res.json({
      success: true,
      data: {
        average: Math.round(average * 100) / 100,
        totalGrades: grades.length,
        subjects,
        semester: semester || 'Tous',
        academicYear: academicYear || 'Toutes',
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllGrades = async (req, res, next) => {
  try {
    const { studentId, semester, academicYear, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (studentId) filter.student = studentId;
    if (semester) filter.semester = semester;
    if (academicYear) filter.academicYear = academicYear;

    const grades = await Grade.find(filter)
      .populate('student', 'name email studentId major academicYear')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Grade.countDocuments(filter);

    res.json({
      success: true,
      data: grades,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateGrade,
  createGrade,
  getMyGrades,
  getGradeById,
  updateGrade,
  deleteGrade,
  getGradeStats,
  getAllGrades,
};