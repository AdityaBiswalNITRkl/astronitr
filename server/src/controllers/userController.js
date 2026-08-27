import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  getAllUsersService,
  approveUserService,
  changeUserRoleService,
  deleteUserService,
} from "../services/userService.js";
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService();

  res
    .status(200)
    .json(new ApiResponse(200, "Users fetched successfully", users));
});

export const approveUser = asyncHandler(async (req, res) => {
  const user = await approveUserService(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, "User approved successfully", user));
});

export const changeUserRole = asyncHandler(async (req, res) => {
  const user = await changeUserRoleService(req.params.id, req.body.role);

  res
    .status(200)
    .json(new ApiResponse(200, "User role updated successfully", user));
});

export const deleteUser = asyncHandler(async (req, res) => {
  await deleteUserService(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,
      "User deleted successfully"
    )
  );
});