import asyncHandler from "../middlewares/asyncHandler.js";
import Task from "../models/Task.js";

// @desc    Create Task
// @route   POST /api/tasks
// @access  Private

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority, subject } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    dueDate,
    priority,
    subject,
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
});

// @desc    Get All Tasks
// @route   GET /api/tasks
// @access  Private

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

// @desc    Update Task
// @route   PUT /api/tasks/:id
// @access  Private

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check ownership
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json({
    success: true,
    message: "Task updated successfully",
    data: updatedTask,
  });
});

// @desc    Delete Task
// @route   DELETE /api/tasks/:id
// @access  Private

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check ownership
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await task.deleteOne();

  res.json({
    success: true,
    message: "Task deleted successfully",
  });
});
