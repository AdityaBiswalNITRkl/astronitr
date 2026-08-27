import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createBlogService,
  getMyBlogsService,
  getApprovedBlogsService,
  getBlogByIdService,
  updateBlogService,
  deleteBlogService,
  getPendingBlogsService,
  approveBlogService,
  rejectBlogService,
  toggleLikeBlogService,
  addCommentService,
  deleteCommentService,
} from "../services/blogService.js";

// Create Blog
export const createBlog = asyncHandler(async (req, res) => {
  const blog = await createBlogService(req.body, req.user.id);

  res.status(201).json(new ApiResponse(201, "Blog created successfully", blog));
});

// Get My Blogs
export const getMyBlogs = asyncHandler(async (req, res) => {
  const blogs = await getMyBlogsService(req.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, "My blogs fetched successfully", blogs));
});

// Get Public Blogs
export const getApprovedBlogs = asyncHandler(async (req, res) => {
  const blogs = await getApprovedBlogsService(req.query);
  res
    .status(200)
    .json(new ApiResponse(200, "Blogs fetched successfully", blogs));
});

// Get Single Blog
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await getBlogByIdService(req.params.id, req.user);

  res.status(200).json(new ApiResponse(200, "Blog fetched successfully", blog));
});

// Update Blog
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await updateBlogService(req.params.id, req.user.id, req.body);

  res.status(200).json(new ApiResponse(200, "Blog updated successfully", blog));
});

// Delete Blog
export const deleteBlog = asyncHandler(async (req, res) => {
  await deleteBlogService(req.params.id, req.user.id);

  res.status(200).json(new ApiResponse(200, "Blog deleted successfully"));
});

// Pending Blogs
export const getPendingBlogs = asyncHandler(async (req, res) => {
  const blogs = await getPendingBlogsService(req.query);

  res
    .status(200)
    .json(new ApiResponse(200, "Pending blogs fetched successfully", blogs));
});

// Approve Blog
export const approveBlog = asyncHandler(async (req, res) => {
  const blog = await approveBlogService(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, "Blog approved successfully", blog));
});

// Reject Blog
export const rejectBlog = asyncHandler(async (req, res) => {
  const { reviewComment } = req.body;

  const blog = await rejectBlogService(req.params.id, reviewComment);

  res
    .status(200)
    .json(new ApiResponse(200, "Blog rejected successfully", blog));
});

export const toggleLikeBlog = asyncHandler(async (req, res) => {
  const blog = await toggleLikeBlogService(req.params.id, req.user.id);

  res.status(200).json(new ApiResponse(200, "Blog like updated", blog));
});

export const addComment = asyncHandler(async (req, res) => {
  const blog = await addCommentService(req.params.id, req.user.id, req.body.comment);

  res.status(201).json(new ApiResponse(201, "Comment added", blog));
});

export const deleteComment = asyncHandler(async (req, res) => {
  const blog = await deleteCommentService(req.params.id, req.params.commentId);

  res.status(200).json(new ApiResponse(200, "Comment deleted", blog));
});
