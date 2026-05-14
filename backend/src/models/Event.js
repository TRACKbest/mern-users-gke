const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
      maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères'],
    },
    startTime: {
      type: Date,
      required: [true, 'La date de début est requise'],
    },
    endTime: {
      type: Date,
      required: [true, 'La date de fin est requise'],
    },
    category: {
      type: String,
      enum: ['meeting', 'task', 'reminder', 'personal', 'other'],
      default: 'task',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    color: {
      type: String,
      default: '#4f46e5',
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ user: 1, startTime: 1 });
eventSchema.index({ user: 1, status: 1 });

eventSchema.pre('validate', function (next) {
  if (this.endTime && this.startTime && this.endTime <= this.startTime) {
    this.invalidate('endTime', 'La date de fin doit être après la date de début');
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
