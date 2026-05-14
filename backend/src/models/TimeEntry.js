const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },
    startTime: {
      type: Date,
      required: [true, 'La date de début est requise'],
    },
    endTime: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number,
      default: 0,
    },
    isRunning: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

timeEntrySchema.index({ user: 1, startTime: -1 });
timeEntrySchema.index({ user: 1, isRunning: 1 });

timeEntrySchema.pre('save', function (next) {
  if (this.startTime && this.endTime) {
    this.duration = Math.round((this.endTime - this.startTime) / 60000);
    this.isRunning = false;
  }
  next();
});

module.exports = mongoose.model('TimeEntry', timeEntrySchema);
