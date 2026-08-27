import Gallery from "../models/Gallery.js";
import {
  uploadImageService,
  getGalleryService,
  deleteImageService,
} from "../services/galleryService.js";

export const uploadImage = async (req, res) => {
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

    const gallery = await uploadImageService(
      req.body.title,
      req.body.description,
      imageUrl,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",
      data: gallery,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getGallery = async (req, res) => {
  try {
    const includePending = req.query.includePending === "true";
    const images = await getGalleryService(includePending);

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const approveImage = async (req, res) => {
  try {
    const image = await Gallery.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image approved successfully.",
      data: image,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    await deleteImageService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};