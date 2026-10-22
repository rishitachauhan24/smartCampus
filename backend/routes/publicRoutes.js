import express from "express";

import {
  getPublicIssues
} from "../controllers/publicController.js";

import {
  getPublicProject
} from "../controllers/projectController.js";


const router = express.Router();


router.get(
  "/issues",
  getPublicIssues
);

router.get(
  "/projects/:slug",
  getPublicProject
);


export default router;