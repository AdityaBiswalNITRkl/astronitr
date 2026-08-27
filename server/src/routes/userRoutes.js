import express from "express";
import {
  getAllUsers,
  approveUser,
  changeUserRole,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getAllUsers);

router.patch("/approve/:id", protect, authorize("admin"), approveUser);

router.patch("/role/:id", protect, authorize("admin"), changeUserRole);

router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;