import TeamMember from "../models/TeamMember.js";

export const createTeamMemberService = async (data) => {
  return await TeamMember.create(data);
};

export const getTeamMembersService = async (includePending = false) => {
  const filter = includePending
    ? { active: true }
    : {
        active: true,
        $or: [{ isApproved: true }, { isApproved: { $exists: false } }],
      };

  return await TeamMember.find(filter).sort({
    displayOrder: 1,
    createdAt: 1,
  });
};

export const getTeamMemberByIdService = async (id, includePending = false) => {
  const filter = includePending
    ? { _id: id }
    : {
        _id: id,
        $or: [{ isApproved: true }, { isApproved: { $exists: false } }],
      };

  const member = await TeamMember.findOne(filter);

  if (!member) {
    throw new Error("Team member not found");
  }

  return member;
};

export const updateTeamMemberService = async (
  id,
  data
) => {
  const member = await TeamMember.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
    }
  );

  if (!member) {
    throw new Error("Team member not found");
  }

  return member;
};

export const deleteTeamMemberService = async (id) => {
  const member = await TeamMember.findById(id);

  if (!member) {
    throw new Error("Team member not found");
  }

  await TeamMember.findByIdAndDelete(id);

  return member;
};