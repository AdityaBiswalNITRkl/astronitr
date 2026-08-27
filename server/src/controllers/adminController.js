import User from "../models/User.js";

export const getPendingMembers = async (req, res) => {
  try {
    const members = await User.find({
      role: "member",
      isApproved: false,
    }).select("-password");

    res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};