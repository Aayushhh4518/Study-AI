const Session = require('../models/Session');

// @desc Get all sessions
// @route GET /api/sessions
// @access Private
const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      user: req.user._id,
    }).populate('subject', 'name color');

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Create session
// @route POST /api/sessions
// @access Private
const createSession = async (req, res) => {
  try {
    const { subject, duration, notes } = req.body;

    if (!subject || !duration) {
      return res.status(400).json({
        message: 'Subject and duration are required',
      });
    }

    const session = await Session.create({
      user: req.user._id,
      subject,
      duration,
      notes,
    });

    const populatedSession = await Session.findById(session._id)
      .populate('subject', 'name color');

    res.status(201).json(populatedSession);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Delete session
// @route DELETE /api/sessions/:id
// @access Private
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: 'Session not found',
      });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    await session.deleteOne();

    res.status(200).json({
      message: 'Session removed',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSessions,
  createSession,
  deleteSession,
};