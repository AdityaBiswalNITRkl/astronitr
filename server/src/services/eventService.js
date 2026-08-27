import Event from "../models/Event.js";
import ApiError from "../utils/ApiError.js";

export const createEventService = async (
  eventData,
  userId
) => {
  const {
    title,
    description,
    date,
    venue,
    category,
    banner,
  } = eventData;

  if (!title || !description || !date || !venue) {
    throw new ApiError(
      400,
      "All required fields must be provided"
    );
  }

  const event = await Event.create({
    title,
    description,
    date,
    venue,
    category,
    banner: banner || "",
    createdBy: userId,
    isApproved: false,
  });

  return event;
};