import Gallery from "../models/Gallery.js";

export const uploadImageService = async (
  title,
  description,
  image,
  uploadedBy
) => {
  return await Gallery.create({
    title,
    description,
    image,
    uploadedBy,
  });
};

export const getGalleryService = async (includePending = false) => {
  const filter = includePending
    ? {}
    : {
        $or: [{ isApproved: true }, { isApproved: { $exists: false } }],
      };

  return await Gallery.find(filter)
    .populate("uploadedBy", "name")
    .sort({ createdAt: -1 });
};

export const deleteImageService = async (imageId) => {
  const image = await Gallery.findById(imageId);

  if (!image) {
    throw new Error("Image not found");
  }

  await Gallery.findByIdAndDelete(imageId);

  return image;
};