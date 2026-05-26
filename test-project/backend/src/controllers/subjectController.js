import asyncHandler from "../middlewares/asyncHandler.js";
import Subject from "../models/Subject.js";

// @desc    Create Subject
// @route   POST /api/subjects
// @access  Private

export const createSubject = asyncHandler(async (req, res) => {
  const { name, description, color, studyHours, progress, weakAreas } =
    req.body;

  if (!name) {
    res.status(400);
    throw new Error("Subject name is required");
  }

  const subject = await Subject.create({
    user: req.user._id,
    name,
    description,
    color,
    studyHours,
    progress,
    weakAreas,
  });

  res.status(201).json({
    success: true,
    message: "Subject created successfully",
    data: subject,
  });
});

// @desc    Get Subjects
// @route   GET /api/subjects
// @access  Private

export const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({
    user: req.user._id,
  }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    count: subjects.length,
    data: subjects,
  });
});

// @desc    Update Subject
// @route   PUT /api/subjects/:id
// @access  Private

export const updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }

  if (subject.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updatedSubject = await Subject.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    },
  );

  res.json({
    success: true,
    message: "Subject updated successfully",
    data: updatedSubject,
  });
});

// @desc    Delete Subject
// @route   DELETE /api/subjects/:id
// @access  Private

export const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }

  if (subject.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await subject.deleteOne();

  res.json({
    success: true,
    message: "Subject deleted successfully",
  });
});
