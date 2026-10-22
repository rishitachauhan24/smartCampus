import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["PROJECT_CREATED", "NOTE_CREATED", "NOTE_UPDATED", "FILE_UPLOADED", "MEMBER_ADDED"],
      required: true
    },
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      default: null
    },
    details: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

contributionSchema.index({ project: 1, createdAt: -1 });

export default mongoose.model("Contribution", contributionSchema);
