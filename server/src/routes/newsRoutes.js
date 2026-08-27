import express from "express";
import { dailyNews } from "../controllers/newsController.js";

const router = express.Router();

router.get("/", dailyNews);

export default router;