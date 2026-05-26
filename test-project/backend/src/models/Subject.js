import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "#3B82F6",
    },

    studyHours: {
      type: Number,
      default: 0,
    },

    progress: {
      type: Number,
      default: 0,
    },

    weakAreas: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
