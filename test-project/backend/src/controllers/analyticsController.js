const Session = require('../models/Session');
const Task = require('../models/Task');
const Subject = require('../models/Subject');

/**
 * @desc    Get dashboard analytics
 * @route   GET /api/analytics
 * @access  Private
 */
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Aggregate Focus Sessions
    const totalSessions = await Session.countDocuments({ user: userId, mode: 'work' });
    const sessionDocs = await Session.find({ user: userId, mode: 'work' });
    const totalFocusMinutes = sessionDocs.reduce((acc, curr) => acc + curr.duration, 0);

    // Aggregate Tasks
    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({ user: userId, completed: true });
    const activeTasksCount = totalTasks - completedTasks;
    const taskCompletionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // Subjects Count
    const subjectsCount = await Subject.countDocuments({ user: userId });

    res.status(200).json({
      focus: {
        totalSessions,
        totalFocusMinutes,
        avgSessionMinutes: totalSessions > 0 ? Math.round(totalFocusMinutes / totalSessions) : 0,
      },
      tasks: {
        totalTasks,
        completedTasks,
        activeTasksCount,
        taskCompletionRate,
      },
      subjects: {
        total: subjectsCount,
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
};
