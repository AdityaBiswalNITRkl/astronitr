import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import { getDailyNews } from "../services/newsService.js";

export const dailyNews = asyncHandler(
  async (req, res) => {
    const news = await getDailyNews();

    res.json(
      new ApiResponse(
        200,
        "Daily News",
        news
      )
    );
  }
);