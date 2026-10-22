import express from "express";

import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssueStatus,
  assignIssue,
  getStaff,
  runIssueAI,
  generateIssueSuggestions
} from "../controllers/issueController.js";

import {
  protect,
  authorize
} from "../middleware/authMiddleware.js";

import {
  uploadIssueImage
} from "../middleware/uploadMiddleware.js";


const router = express.Router();


router.use(protect);


router.post(
  "/",
  authorize("student"),
  uploadIssueImage,
  createIssue
);


router.get(
  "/",
  getIssues
);


router.get(
  "/staff",
  authorize("admin"),
  getStaff
);


router.get(
  "/:id",
  getIssueById
);


router.patch(
  "/:id/status",
  authorize("staff", "admin"),
  updateIssueStatus
);


router.patch(
  "/:id/assign",
  authorize("admin"),
  assignIssue
);


router.post(
  "/:id/ai-suggestions",
  authorize("student", "staff", "admin"),
  generateIssueSuggestions
);


router.post(
  "/:id/ai-analyze",
  authorize("staff", "admin"),
  runIssueAI
);


export default router;