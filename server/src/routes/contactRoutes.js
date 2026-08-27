import express from "express";
import {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../controllers/contactController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createContactMessage);
router.get("/", protect, authorize("admin", "eb"), getContactMessages);
router.patch("/:id", protect, authorize("admin", "eb"), updateContactMessageStatus);
router.delete("/:id", protect, authorize("admin", "eb"), deleteContactMessage);

export default router;
