import express from "express";

import { dailyFact } from "../controllers/aiController.js";

const router = express.Router();

router.get("/daily-fact", dailyFact);

export default router;