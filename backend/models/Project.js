import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      enum: ["owner", "collaborator"],
      default: "collaborator"
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const fileSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    url: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ""
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private"
    },
    shareToken: {
      type: String,
      unique: true,
      sparse: true
    },
    tags: {
      type: [String],
      default: []
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: {
      type: [memberSchema],
      default: []
    },
    files: {
      type: [fileSchema],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
