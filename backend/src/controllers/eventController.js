const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');

const validateEvent = [
  body('title').trim().notEmpty().withMessage('Le titre est requis').isLength({ max: 200 }),
  body('startTime').isISO8601().withMessage('Date de début invalide'),
  body('endTime').isISO8601().withMessage('Date de fin invalide'),
  body('category').optional().isIn(['meeting', 'task', 'reminder', 'personal', 'other']),
  body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
];

const createEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const event = await Event.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

const getMyEvents = async (req, res, next) => {
  try {
    const { start, end, category, status, page = 1, limit = 50 } = req.query;

    const filter = { user: req.user._id };
    if (start || end) {
      filter.startTime = {};
      if (start) filter.startTime.$gte = new Date(start);
      if (end) filter.startTime.$lte = new Date(end);
    }
    if (category) filter.category = category;
    if (status) filter.status = status;

    const events = await Event.find(filter)
      .sort({ startTime: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      data: events,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.user._id });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Événement non trouvé' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Événement non trouvé' });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Événement non trouvé' });
    }
    res.json({ success: true, message: 'Événement supprimé' });
  } catch (error) {
    next(error);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const { userId, start, end, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (userId) filter.user = userId;
    if (start || end) {
      filter.startTime = {};
      if (start) filter.startTime.$gte = new Date(start);
      if (end) filter.startTime.$lte = new Date(end);
    }

    const events = await Event.find(filter)
      .populate('user', 'name email')
      .sort({ startTime: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      data: events,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateEvent,
  createEvent,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getAllEvents,
};
