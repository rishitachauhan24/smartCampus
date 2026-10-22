import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    content: {
      type: String,
      required: true,
      maxlength: 30000
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    aiSummary: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

noteSchema.index({ project: 1, updatedAt: -1 });

export default mongoose.model("Note", noteSchema);
