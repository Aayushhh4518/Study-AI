const geminiService = require('../services/geminiService');
const Task = require('../models/Task');
const Subject = require('../models/Subject');

/**
 * @desc    Generate AI response
 * @route   POST /api/ai/chat
 * @access  Private
 */
const chatWithAI = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400);
      throw new Error('Prompt is required');
    }

    // Gather context for the AI
    const tasks = await Task.find({ user: req.user.id, completed: false }).select('title priority dueDate');
    const subjects = await Subject.find({ user: req.user.id }).select('title progress');

    const context = {
      tasks,
      subjects
    };

    const responseText = await geminiService.generateResponse(prompt, context);

    res.status(200).json({ reply: responseText });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chatWithAI,
};
