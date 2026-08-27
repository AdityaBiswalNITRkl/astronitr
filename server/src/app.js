import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import nasaRoutes from "./routes/nasaRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("src/uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletters", newsletterRoutes);
app.use("/api/nasa", nasaRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/news", newsRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AstroNITR Backend is running 🚀",
  });
});

export default app;

app.use(errorHandler);