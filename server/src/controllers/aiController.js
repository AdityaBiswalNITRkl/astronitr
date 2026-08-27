import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import { getDailyFact } from "../services/aiService.js";

export const dailyFact = asyncHandler(
  async (req, res) => {
    const fact = await getDailyFact();

    res.json(
      new ApiResponse(
        200,
        "Daily Fact",
        fact
      )
    );
  }
);