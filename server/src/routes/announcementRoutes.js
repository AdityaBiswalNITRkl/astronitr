import express from "express";

import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
  getAnnouncementById,
  updateAnnouncement,
} from "../controllers/announcementController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAnnouncements);

router.post(
  "/",
  protect,
  authorize("admin", "eb"),
  createAnnouncement
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "eb"),
  deleteAnnouncement
);
router.get("/:id", getAnnouncementById);

router.put(
  "/:id",
  protect,
  authorize("admin", "eb"),
  updateAnnouncement
);

export default router;