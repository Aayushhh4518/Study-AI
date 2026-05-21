const Subject = require('../models/Subject');

// @desc Get all subjects
// @route GET /api/subjects
// @access Private
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user.id });

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create subject
// @route POST /api/subjects
// @access Private
const createSubject = async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({
        message: 'Subject name is required',
      });
    }

    const subject = await Subject.create({
      user: req.user.id,
      name,
      color: color || 'blue',
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete subject
// @route DELETE /api/subjects/:id
// @access Private
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: 'Subject not found',
      });
    }

    if (subject.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    await subject.deleteOne();

    res.json({
      message: 'Subject removed',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubjects,
  createSubject,
  deleteSubject,
};