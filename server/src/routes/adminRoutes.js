import express from "express";
import { getPendingMembers } from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/pending-members",
  protect,
  authorize("admin"),
  getPendingMembers
);

export default router;