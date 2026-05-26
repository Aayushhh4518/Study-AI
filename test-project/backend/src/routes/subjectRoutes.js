import express from "express";

import protect from "../middlewares/authMiddleware.js";

import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

router.route("/").get(protect, getSubjects).post(protect, createSubject);

router.route("/:id").put(protect, updateSubject).delete(protect, deleteSubject);

export default router;
