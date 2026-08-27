import {
  createAnnouncementService,
  getAnnouncementsService,
  deleteAnnouncementService,
  getAnnouncementByIdService,
  updateAnnouncementService,
} from "../services/announcementService.js";

export const createAnnouncement = async (req, res) => {
  try {
    const announcement =
      await createAnnouncementService(
        req.body.title,
        req.body.description,
        req.body.pinned,
        req.body.expiryDate,
        req.user.id
      );

    res.status(201).json({
      success: true,
      message: "Announcement created successfully.",
      data: announcement,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const announcements =
      await getAnnouncementsService();

    res.status(200).json({
      success: true,
      data: announcements,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    await deleteAnnouncementService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAnnouncementById = async (
  req,
  res
) => {
  try {
    const announcement =
      await getAnnouncementByIdService(
        req.params.id
      );

    res.json({
      success: true,
      data: announcement,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateAnnouncement = async (
  req,
  res
) => {
  try {
    const announcement =
      await updateAnnouncementService(
        req.params.id,
        req.body
      );

    res.json({
      success: true,
      message: "Announcement updated.",
      data: announcement,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};