import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/subjects", subjectRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StudyAI Backend Running",
  });
});

export default app;
