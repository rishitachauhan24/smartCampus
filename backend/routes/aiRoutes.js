import express from "express";

import {
  generateSummary,
  suggestAction
} from "../controllers/aiController.js";

import {
  protect,
  authorize
} from "../middleware/authMiddleware.js";


const router = express.Router();


router.use(protect);


router.post(
  "/summary",
  authorize("staff", "admin"),
  generateSummary
);


router.post(
  "/suggest-action",
  authorize("staff", "admin"),
  suggestAction
);


export default router;