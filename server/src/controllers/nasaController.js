import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getAPOD } from "../services/nasaService.js";

export const getAstronomyPicture =
  asyncHandler(async (req, res) => {
    const data = await getAPOD();

    res.json(
      new ApiResponse(
        200,
        "Astronomy Picture of the Day",
        data
      )
    );
  });