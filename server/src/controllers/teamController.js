import {
  createTeamMemberService,
  getTeamMembersService,
  getTeamMemberByIdService,
  updateTeamMemberService,
  deleteTeamMemberService,
} from "../services/teamService.js";

export const createTeamMember = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file.",
      });
    }

    const imageUrl = req.file.path?.startsWith("http")
      ? req.file.path
      : `/uploads/${req.file.filename}`;

    const member = await createTeamMemberService({
      ...req.body,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Team member added successfully.",
      data: member,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getTeamMembers = async (
  req,
  res
) => {
  try {
    const includePending = req.query.includePending === "true";
    const members =
      await getTeamMembersService(includePending);

    res.json({
      success: true,
      data: members,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getTeamMemberById = async (
  req,
  res
) => {
  try {
    const includePending = req.query.includePending === "true";
    const member =
      await getTeamMemberByIdService(
        req.params.id,
        includePending
      );

    res.json({
      success: true,
      data: member,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const approveTeamMember = async (
  req,
  res
) => {
  try {
    const member = await updateTeamMemberService(
      req.params.id,
      { isApproved: true }
    );

    res.json({
      success: true,
      message: "Team member approved successfully.",
      data: member,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateTeamMember = async (
  req,
  res
) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.path?.startsWith("http")
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    }

    const member = await updateTeamMemberService(
      req.params.id,
      updateData
    );

    res.json({
      success: true,
      message: "Updated successfully.",
      data: member,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteTeamMember = async (
  req,
  res
) => {
  try {
    await deleteTeamMemberService(
      req.params.id
    );

    res.json({
      success: true,
      message: "Deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};