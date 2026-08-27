import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  registerUser,
  loginUser,
  getProfileService,
} from "../services/authService.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json(
    new ApiResponse(
      201,
      "User registered successfully",
      user
    )
  );
});

export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);

  res.status(200).json(
    new ApiResponse(
      200,
      "Login successful",
      data
    )
  );
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await getProfileService(req.user.id);

  res.status(200).json(
    new ApiResponse(
      200,
      "Profile fetched successfully",
      user
    )
  );
});