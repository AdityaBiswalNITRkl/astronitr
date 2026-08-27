import dotenv from "dotenv";

dotenv.config();

console.log("Loaded Cloud:", process.env.CLOUDINARY_CLOUD_NAME);