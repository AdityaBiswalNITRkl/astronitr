import User from "../models/User.js";

export const getAllUsersService = async () => {
  return await User.find().select("-password");
};

export const approveUserService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.isApproved = true;
  await user.save();
  return user;
};

export const changeUserRoleService = async (userId, role) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.role = role;
  await user.save();
  return user;
};

export const deleteUserService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  await User.findByIdAndDelete(userId);
  return user;
};
