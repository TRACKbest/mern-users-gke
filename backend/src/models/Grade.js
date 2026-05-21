const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: [true, 'Le sujet est requis'],
      trim: true,
      maxlength: [100, 'Le sujet ne peut pas dépasser 100 caractères'],
    },
    grade: {
      type: Number,
      required: [true, 'La note est requise'],
      min: [0, 'La note ne peut pas être inférieure à 0'],
      max: [20, 'La note ne peut pas dépasser 20'],
    },
    coefficient: {
      type: Number,
      default: 1,
      min: [1, 'Le coefficient doit être au moins 1'],
    },
    semester: {
      type: String,
      required: [true, 'Le semestre est requis'],
      enum: ['Semestre 1', 'Semestre 2', 'Semestre 3', 'Semestre 4', 'Semestre 5', 'Semestre 6'],
    },
    academicYear: {
      type: String,
      required: [true, "L'année académique est requise"],
      trim: true,
    },
    category: {
      type: String,
      enum: ['examen', 'devoir', 'projet', 'tp', 'partiel'],
      default: 'devoir',
    },
    teacher: {
      type: String,
      trim: true,
      maxlength: [100, 'Le nom du professeur ne peut pas dépasser 100 caractères'],
    },
    comments: {
      type: String,
      trim: true,
      maxlength: [500, 'Les commentaires ne peuvent pas dépasser 500 caractères'],
    },
  },
  {
    timestamps: true,
  }
);

gradeSchema.index({ student: 1, semester: 1, academicYear: 1 });
gradeSchema.index({ student: 1, subject: 1 });

module.exports = mongoose.model('Grade', gradeSchema);