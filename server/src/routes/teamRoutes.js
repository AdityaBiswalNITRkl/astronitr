import express from "express";

import {
  createTeamMember,
  getTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  approveTeamMember,
  deleteTeamMember,
} from "../controllers/teamController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getTeamMembers);

router.get("/:id", getTeamMemberById);

router.post(
  "/",
  protect,
  authorize("admin", "eb"),
  upload.single("image"),
  createTeamMember
);

router.put(
  "/:id",
  protect,
  authorize("admin", "eb"),
  upload.single("image"),
  updateTeamMember
);

router.patch(
  "/:id/approve",
  protect,
  authorize("admin", "eb"),
  approveTeamMember
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "eb"),
  deleteTeamMember
);

export default router;