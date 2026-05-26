import Task from "../models/Task.js";
import Subject from "../models/Subject.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// @desc    Get Analytics
// @route   GET /api/analytics
// @access  Private

export const getAnalytics = asyncHandler(async (req, res) => {
  // User Tasks
  const tasks = await Task.find({
    user: req.user._id,
  });

  // User Subjects
  const subjects = await Subject.find({
    user: req.user._id,
  });

  // Task Analytics
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  const completionRate =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  // Subject Analytics
  const totalSubjects = subjects.length;

  const totalStudyHours = subjects.reduce(
    (acc, subject) => acc + subject.studyHours,
    0
  );

  const averageProgress =
    totalSubjects > 0
      ? Math.round(
          subjects.reduce(
            (acc, subject) => acc + subject.progress,
            0
          ) / totalSubjects
        )
      : 0;

  // Weak Subjects
  const weakSubjects = subjects
    .filter((subject) => subject.progress < 50)
    .map((subject) => ({
      name: subject.name,
      progress: subject.progress,
    }));

  // Productivity Score
  const productivityScore = Math.round(
    (completionRate + averageProgress) / 2
  );

  res.json({
    success: true,

    data: {
      taskAnalytics: {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate,
      },

      subjectAnalytics: {
        totalSubjects,
        totalStudyHours,
        averageProgress,
        weakSubjects,
      },

      productivityScore,
    },
  });
});
