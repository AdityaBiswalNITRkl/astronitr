import Newsletter from "../models/Newsletter.js";
import ApiError from "../utils/ApiError.js";

export const createNewsletterService = async (data, userId) => {
  const { title, content } = data;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  const newsletter = await Newsletter.create({
    ...data,
    createdBy: userId,
  });

  return newsletter;
};

export const getNewslettersService = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 8;
  const skip = (page - 1) * limit;
  const search = query.search || "";
  const sort = query.sort || "newest";

  const filter = {
    published: true,
  };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { summary: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  const sortOption = sort === "oldest" ? { editionDate: 1 } : { editionDate: -1 };

  const newsletters = await Newsletter.find(filter)
    .populate("createdBy", "name email")
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const totalNewsletters = await Newsletter.countDocuments(filter);

  return {
    newsletters,
    currentPage: page,
    totalPages: Math.ceil(totalNewsletters / limit),
    totalNewsletters,
  };
};

export const getNewsletterByIdService = async (id, currentUser) => {
  const newsletter = await Newsletter.findById(id).populate("createdBy", "name email");

  if (!newsletter) {
    throw new ApiError(404, "Newsletter not found");
  }

  if (newsletter.published) {
    return newsletter;
  }

  if (!currentUser) {
    throw new ApiError(403, "Access denied");
  }

  if (["admin", "eb"].includes(currentUser.role)) {
    return newsletter;
  }

  if (newsletter.createdBy?._id.toString() === currentUser.id) {
    return newsletter;
  }

  throw new ApiError(403, "Access denied");
};

export const updateNewsletterService = async (id, data) => {
  const newsletter = await Newsletter.findById(id);

  if (!newsletter) {
    throw new ApiError(404, "Newsletter not found");
  }

  Object.assign(newsletter, data);
  await newsletter.save();

  return newsletter;
};

export const deleteNewsletterService = async (id) => {
  const newsletter = await Newsletter.findById(id);

  if (!newsletter) {
    throw new ApiError(404, "Newsletter not found");
  }

  await Newsletter.findByIdAndDelete(id);

  return newsletter;
};
