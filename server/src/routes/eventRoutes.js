import express from "express";

import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  approveEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/upload.js";

const router = express.Router();

const getAdminEvents = (req, res, next) => {
  req.query.includePending = "true";
  return getEvents(req, res, next);
};

// Public Routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Admin / EB Routes
router.get(
  "/all",
  protect,
  authorize("admin", "eb"),
  getAdminEvents
);

router.post(
  "/",
  protect,
  authorize("admin", "eb"),
  upload.single("banner"),
  createEvent
);

router.put(
  "/:id",
  protect,
  authorize("admin", "eb"),
  upload.single("banner"),
  updateEvent
);

router.patch(
  "/:id/approve",
  protect,
  authorize("admin", "eb"),
  approveEvent
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteEvent
);

export default router;