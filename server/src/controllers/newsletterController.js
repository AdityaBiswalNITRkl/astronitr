import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createNewsletterService,
  getNewslettersService,
  getNewsletterByIdService,
  updateNewsletterService,
  deleteNewsletterService,
} from "../services/newsletterService.js";

export const createNewsletter = asyncHandler(async (req, res) => {
  const newsletter = await createNewsletterService(req.body, req.user.id);

  res.status(201).json(new ApiResponse(201, "Newsletter created successfully", newsletter));
});

export const getNewsletters = asyncHandler(async (req, res) => {
  const newsletters = await getNewslettersService(req.query);

  res.status(200).json(new ApiResponse(200, "Newsletters fetched successfully", newsletters));
});

export const getNewsletterById = asyncHandler(async (req, res) => {
  const newsletter = await getNewsletterByIdService(req.params.id, req.user);

  res.status(200).json(new ApiResponse(200, "Newsletter fetched successfully", newsletter));
});

export const updateNewsletter = asyncHandler(async (req, res) => {
  const newsletter = await updateNewsletterService(req.params.id, req.body);

  res.status(200).json(new ApiResponse(200, "Newsletter updated successfully", newsletter));
});

export const deleteNewsletter = asyncHandler(async (req, res) => {
  await deleteNewsletterService(req.params.id);

  res.status(200).json(new ApiResponse(200, "Newsletter deleted successfully", null));
});
