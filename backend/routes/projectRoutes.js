import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { uploadProjectFile } from "../middleware/projectUploadMiddleware.js";
import {
  listProjects,
  createProject,
  getProjectDetails,
  updateProject,
  addMember,
  removeMember,
  listNotes,
  createNote,
  updateNote,
  summarizeNote,
  uploadFile,
  getAnalytics
} from "../controllers/projectController.js";

const router = express.Router();

router.use(protect);

router.get("/", listProjects);
router.post("/", createProject);
router.get("/:id", getProjectDetails);
router.patch("/:id", updateProject);
router.post("/:id/members", addMember);
router.delete("/:id/members/:userId", removeMember);
router.get("/:id/notes", listNotes);
router.post("/:id/notes", createNote);
router.patch("/:id/notes/:noteId", updateNote);
router.post("/:id/notes/:noteId/ai-summary", summarizeNote);
router.post("/:id/files", uploadProjectFile, uploadFile);
router.get("/:id/analytics", getAnalytics);

export default router;