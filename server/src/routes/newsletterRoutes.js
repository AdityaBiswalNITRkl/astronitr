import express from "express";
import {
  createNewsletter,
  getNewsletters,
  getNewsletterById,
  updateNewsletter,
  deleteNewsletter,
} from "../controllers/newsletterController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getNewsletters);
router.get("/:id", getNewsletterById);
router.post("/", protect, authorize("admin", "eb"), createNewsletter);
router.put("/:id", protect, authorize("admin", "eb"), updateNewsletter);
router.delete("/:id", protect, authorize("admin", "eb"), deleteNewsletter);

export default router;
