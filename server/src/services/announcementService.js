import Announcement from "../models/Announcement.js";

export const createAnnouncementService = async (
  title,
  description,
  pinned,
  expiryDate,
  createdBy
) => {
  return await Announcement.create({
    title,
    description,
    pinned,
    expiryDate,
    createdBy,
  });
};

export const getAnnouncementsService = async () => {
  return await Announcement.find()
    .populate("createdBy", "name")
    .sort({
      pinned: -1,
      createdAt: -1,
    });
};

export const deleteAnnouncementService = async (
  announcementId
) => {
  const announcement =
    await Announcement.findById(announcementId);

  if (!announcement) {
    throw new Error("Announcement not found");
  }

  await Announcement.findByIdAndDelete(
    announcementId
  );

  return announcement;
};

export const getAnnouncementByIdService = async (id) => {
  const announcement =
    await Announcement.findById(id);

  if (!announcement) {
    throw new Error("Announcement not found");
  }

  return announcement;
};

export const updateAnnouncementService = async (
  id,
  data
) => {
  const announcement =
    await Announcement.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

  if (!announcement) {
    throw new Error("Announcement not found");
  }

  return announcement;
};