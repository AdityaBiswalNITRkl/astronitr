import express from "express";

import {
  uploadImage,
  getGallery,
  approveImage,
  deleteImage,
} from "../controllers/galleryController.js";
import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

const getAdminGallery = (req, res, next) => {
  req.query.includePending = "true";
  return getGallery(req, res, next);
};

router.get("/", getGallery);
router.get("/all", protect, authorize("admin", "eb"), getAdminGallery);

router.post(
  "/",
  protect,
  authorize("admin", "eb"),
  upload.single("image"),
  uploadImage
);

router.patch(
  "/:id/approve",
  protect,
  authorize("admin", "eb"),
  approveImage
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "eb"),
  deleteImage
);

export default router;