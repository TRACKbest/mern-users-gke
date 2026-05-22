const Grade = require('../models/Grade');

// Get all grades for a user
exports.getGrades = async (req, res) => {
  try {
    const grades = await Grade.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grades', error: error.message });
  }
};

// Get a single grade by ID
exports.getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findOne({ _id: req.params.id, user: req.user.id });
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }
    res.json(grade);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grade', error: error.message });
  }
};

// Create a new grade
exports.createGrade = async (req, res) => {
  try {
    const gradeData = {
      ...req.body,
      user: req.user.id
    };
    
    // Validate required fields
    if (!gradeData.subject || !gradeData.grade || !gradeData.coefficient || !gradeData.semester || !gradeData.academicYear) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Validate grade range
    const gradeValue = parseFloat(gradeData.grade);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 20) {
      return res.status(400).json({ message: 'Grade must be between 0 and 20' });
    }
    
    // Validate coefficient
    const coefficientValue = parseInt(gradeData.coefficient);
    if (isNaN(coefficientValue) || coefficientValue < 1) {
      return res.status(400).json({ message: 'Coefficient must be at least 1' });
    }
    
    const grade = await Grade.create(gradeData);
    res.status(201).json(grade);
  } catch (error) {
    console.error('Error creating grade:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: error.message });
    }
    res.status(500).json({ message: 'Error creating grade', error: error.message });
  }
};

// Update a grade
exports.updateGrade = async (req, res) => {
  try {
    const grade = await Grade.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }
    res.json(grade);
  } catch (error) {
    res.status(400).json({ message: 'Error updating grade', error: error.message });
  }
};

// Delete a grade
exports.deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }
    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting grade', error: error.message });
  }
};

// Get grade statistics
exports.getGradeStats = async (req, res) => {
  try {
    const grades = await Grade.find({ user: req.user.id });
    
    if (grades.length === 0) {
      return res.json({
        average: 0,
        total: 0,
        bySemester: {}
      });
    }

    let totalWeighted = 0;
    let totalCoefficient = 0;
    const bySemester = {};

    grades.forEach(grade => {
      const weighted = grade.grade * grade.coefficient;
      totalWeighted += weighted;
      totalCoefficient += grade.coefficient;

      if (!bySemester[grade.semester]) {
        bySemester[grade.semester] = {
          total: 0,
          count: 0,
          grades: []
        };
      }
      bySemester[grade.semester].total += grade.grade;
      bySemester[grade.semester].count += 1;
      bySemester[grade.semester].grades.push(grade.grade);
    });

    // Calculate averages per semester
    Object.keys(bySemester).forEach(semester => {
      bySemester[semester].average = bySemester[semester].total / bySemester[semester].count;
    });

    const average = totalCoefficient > 0 ? totalWeighted / totalCoefficient : 0;

    res.json({
      average: Math.round(average * 100) / 100,
      total: grades.length,
      bySemester
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating statistics', error: error.message });
  }
};