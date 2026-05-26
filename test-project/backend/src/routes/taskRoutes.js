import express from "express";

import protect from "../middlewares/authMiddleware.js";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();

// Get all tasks + Create task
router.route("/").get(protect, getTasks).post(protect, createTask);

// Update + Delete task
router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

export default router;
