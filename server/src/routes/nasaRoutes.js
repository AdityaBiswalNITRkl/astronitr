import express from "express";
import { getAstronomyPicture } from "../controllers/nasaController.js";

const router = express.Router();

router.get("/apod", getAstronomyPicture);

export default router;