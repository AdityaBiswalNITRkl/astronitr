import express from "express";

import {
  createBlog,
  getMyBlogs,
  getApprovedBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getPendingBlogs,
  approveBlog,
  rejectBlog,
  toggleLikeBlog,
  addComment,
  deleteComment,
} from "../controllers/blogController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
=========================================
PUBLIC ROUTES
=========================================
*/

// All approved blogs
router.get("/", getApprovedBlogs);

/*
=========================================
MEMBER ROUTES
=========================================
*/

router.post("/", protect, createBlog);

router.get("/my/blogs", protect, getMyBlogs);
router.post("/:id/like", protect, toggleLikeBlog);
router.post("/:id/comments", protect, addComment);
router.delete("/:id/comments/:commentId", protect, deleteComment);

router.put("/:id", protect, updateBlog);

router.delete("/:id", protect, deleteBlog);

/*
=========================================
EB / ADMIN
=========================================
*/

router.get("/pending/all", protect, authorize("eb", "admin"), getPendingBlogs);

router.patch("/:id/approve", protect, authorize("eb", "admin"), approveBlog);

router.patch("/:id/reject", protect, authorize("eb", "admin"), rejectBlog);
/*
=========================================
PUBLIC ROUTES
=========================================
*/
// Single blog
router.get("/:id", getBlogById);

export default router;
