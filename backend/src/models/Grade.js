const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  grade: {
    type: Number,
    required: true,
    min: 0,
    max: 20
  },
  coefficient: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  semester: {
    type: String,
    required: true,
    enum: ['Semester 1', 'Semester 2']
  },
  academicYear: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Grade', gradeSchema);