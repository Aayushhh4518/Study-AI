import express from "express";

import protect from "../middlewares/authMiddleware.js";

import { getAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

// Analytics Route
router.get("/", protect, getAnalytics);

export default router;
