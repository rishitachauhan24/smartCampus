import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      default: null
    },

    action: {
      type: String,
      required: true
    },

    details: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Activity", activitySchema);