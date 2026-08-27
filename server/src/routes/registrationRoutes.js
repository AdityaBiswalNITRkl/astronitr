import express from "express";
import {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getAllRegistrations,
  getEventRegistrations,
  updateAttendance,
} from "../controllers/registrationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, registerForEvent);
router.delete("/:eventId", protect, cancelRegistration);
router.get("/me", protect, getMyRegistrations);
router.get("/", protect, authorize("admin", "eb"), getAllRegistrations);
router.get("/event/:eventId", protect, authorize("admin", "eb"), getEventRegistrations);
router.patch("/:registrationId/attendance", protect, authorize("admin", "eb"), updateAttendance);

export default router;
