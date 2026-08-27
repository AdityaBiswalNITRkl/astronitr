import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

const storage = hasCloudinaryConfig
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "AstroNITR-Gallery",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
    })
  : multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadDir),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path
          .basename(file.originalname, ext)
          .replace(/\s+/g, "-")
          .toLowerCase();
        cb(null, `${Date.now()}-${baseName}${ext}`);
      },
    });

export default multer({ storage });
