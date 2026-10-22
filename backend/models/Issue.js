import mongoose from "mongoose";

export const ISSUE_CATEGORIES = [
  "Wi-Fi / Network",
  "Classroom",
  "Hostel",
  "Library",
  "Cleanliness",
  "Electrical",
  "Water",
  "Other"
];

export const ISSUE_PRIORITIES = [
  "Low",
  "Medium",
  "High",
  "Critical"
];

export const ISSUE_STATUSES = [
  "Pending",
  "Assigned",
  "In Progress",
  "Resolved"
];

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },

    category: {
      type: String,
      enum: ISSUE_CATEGORIES,
      required: true
    },

    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    priority: {
      type: String,
      enum: ISSUE_PRIORITIES,
      default: "Medium"
    },

    status: {
      type: String,
      enum: ISSUE_STATUSES,
      default: "Pending"
    },

    isAnonymous: {
      type: Boolean,
      default: false
    },

    imageUrl: {
      type: String,
      default: ""
    },

    aiSummary: {
      type: String,
      default: ""
    },

    aiSuggestedAction: {
      type: String,
      default: ""
    },

    aiReason: {
      type: String,
      default: ""
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Issue", issueSchema);