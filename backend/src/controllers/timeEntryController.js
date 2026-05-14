const { body, validationResult } = require('express-validator');
const TimeEntry = require('../models/TimeEntry');

const validateTimeEntry = [
  body('startTime').isISO8601().withMessage('Date de début invalide'),
  body('endTime').isISO8601().withMessage('Date de fin invalide'),
  body('description').optional().trim().isLength({ max: 500 }),
];

const startTimer = async (req, res, next) => {
  try {
    const running = await TimeEntry.findOne({ user: req.user._id, isRunning: true });
    if (running) {
      return res.status(400).json({
        success: false,
        message: 'Un timer est déjà en cours. Arrêtez-le avant d\'en démarrer un nouveau.',
      });
    }

    const entry = await TimeEntry.create({
      user: req.user._id,
      description: req.body.description || '',
      event: req.body.eventId || null,
      startTime: new Date(),
      isRunning: true,
    });

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

const stopTimer = async (req, res, next) => {
  try {
    const entry = await TimeEntry.findOne({ _id: req.params.id, user: req.user._id, isRunning: true });
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Timer actif non trouvé' });
    }

    entry.endTime = new Date();
    entry.isRunning = false;
    await entry.save();

    res.json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

const createManualEntry = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { startTime, endTime, description, eventId } = req.body;

    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({ success: false, message: 'La date de fin doit être après la date de début' });
    }

    const entry = await TimeEntry.create({
      user: req.user._id,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      description: description || '',
      event: eventId || null,
      isRunning: false,
    });

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

const getMyTimeEntries = async (req, res, next) => {
  try {
    const { start, end, page = 1, limit = 50 } = req.query;

    const filter = { user: req.user._id };
    if (start || end) {
      filter.startTime = {};
      if (start) filter.startTime.$gte = new Date(start);
      if (end) filter.startTime.$lte = new Date(end);
    }

    const entries = await TimeEntry.find(filter)
      .populate('event', 'title category')
      .sort({ startTime: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await TimeEntry.countDocuments(filter);

    res.json({
      success: true,
      data: entries,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getActiveTimer = async (req, res, next) => {
  try {
    const entry = await TimeEntry.findOne({ user: req.user._id, isRunning: true })
      .populate('event', 'title category');
    res.json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

const updateTimeEntry = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const entry = await TimeEntry.findOne({ _id: req.params.id, user: req.user._id });
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entrée non trouvée' });
    }

    if (entry.isRunning) {
      return res.status(400).json({ success: false, message: 'Impossible de modifier un timer en cours' });
    }

    const { startTime, endTime, description } = req.body;
    if (startTime) entry.startTime = new Date(startTime);
    if (endTime) entry.endTime = new Date(endTime);
    if (description !== undefined) entry.description = description;

    await entry.save();
    res.json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

const deleteTimeEntry = async (req, res, next) => {
  try {
    const entry = await TimeEntry.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entrée non trouvée' });
    }
    res.json({ success: true, message: 'Entrée supprimée' });
  } catch (error) {
    next(error);
  }
};

const getTimeSummary = async (req, res, next) => {
  try {
    const { period = 'week' } = req.query;

    const now = new Date();
    let startDate;

    if (period === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    }

    const summary = await TimeEntry.aggregate([
      {
        $match: {
          user: req.user._id,
          startTime: { $gte: startDate },
          isRunning: false,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } },
          totalMinutes: { $sum: '$duration' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalMinutes = summary.reduce((acc, day) => acc + day.totalMinutes, 0);

    res.json({
      success: true,
      data: {
        period,
        days: summary,
        totalMinutes,
        totalHours: Math.round((totalMinutes / 60) * 100) / 100,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllTimeEntries = async (req, res, next) => {
  try {
    const { userId, start, end, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (userId) filter.user = userId;
    if (start || end) {
      filter.startTime = {};
      if (start) filter.startTime.$gte = new Date(start);
      if (end) filter.startTime.$lte = new Date(end);
    }

    const entries = await TimeEntry.find(filter)
      .populate('user', 'name email')
      .populate('event', 'title category')
      .sort({ startTime: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await TimeEntry.countDocuments(filter);

    res.json({
      success: true,
      data: entries,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
