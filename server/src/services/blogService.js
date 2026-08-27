import Blog from "../models/Blog.js";
import ApiError from "../utils/ApiError.js";

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

const calculateReadingTime = (content) => {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;

  return Math.max(1, Math.ceil(words / 200));
};
// Create Blog
export const createBlogService = async (blogData, userId) => {
  const { title, excerpt, content, coverImage, tags } = blogData;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  let slug = generateSlug(title);

  const existing = await Blog.findOne({ slug });

  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const blog = await Blog.create({
    title,
    slug,
    excerpt,
    content,
    coverImage,
    tags,
    author: userId,
    readingTime: calculateReadingTime(content),
  });

  return blog;
};

// Get Blogs Created by Logged-in User
export const getMyBlogsService = async (userId) => {
  return await Blog.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate("author", "name email");
};

// Get All Approved Blogs (Public)
export const getApprovedBlogsService = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 6;
  const skip = (page - 1) * limit;

  const search = query.search || "";
  const tag = query.tag || "";
  const sort = query.sort || "newest";

  const filter = {
    status: "approved",
  };

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        content: {
          $regex: search,
          $options: "i",
        },
      },
      {
        tags: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (tag) {
    filter.tags = tag;
  }

  let sortOption = {
    publishedAt: -1,
  };

  if (sort === "oldest") {
    sortOption = {
      publishedAt: 1,
    };
  }

  if (sort === "popular") {
    sortOption = {
      views: -1,
    };
  }

  const blogs = await Blog.find(filter)
    .populate("author", "name")
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const totalBlogs = await Blog.countDocuments(filter);

  return {
    blogs,
    currentPage: page,
    totalPages: Math.ceil(totalBlogs / limit),
    totalBlogs,
  };
};
// Get Single Blog
export const getBlogByIdService = async (blogId, currentUser) => {
  const blog = await Blog.findById(blogId).populate(
    "author",
    "name email role",
  );

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.status === "approved") {
    blog.views += 1;
    await blog.save();

    return blog;
  }

  if (!currentUser) {
    throw new ApiError(403, "Access denied");
  }

  if (currentUser.role === "admin" || currentUser.role === "eb") {
    return blog;
  }

  if (blog.author._id.toString() === currentUser.id) {
    return blog;
  }

  throw new ApiError(403, "Access denied");
};
// Update Blog
export const updateBlogService = async (blogId, userId, blogData) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.author.toString() !== userId) {
    throw new ApiError(403, "You can only edit your own blogs");
  }

  Object.assign(blog, blogData);

  if (blogData.title) {
    let slug = generateSlug(blogData.title);

    const exists = await Blog.findOne({
      slug,
      _id: { $ne: blogId },
    });

    if (exists) {
      slug = `${slug}-${Date.now()}`;
    }

    blog.slug = slug;
  }

  if (blogData.content) {
    blog.readingTime = calculateReadingTime(blogData.content);
  }

  blog.status = "pending";
  blog.reviewComment = "";
  blog.publishedAt = null;

  await blog.save();

  return blog;
};
// Delete Blog
export const deleteBlogService = async (blogId, userId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.author.toString() !== userId) {
    throw new ApiError(403, "You can only delete your own blogs");
  }

  await Blog.findByIdAndDelete(blogId);
};

// Get Pending Blogs (EB/Admin)
export const getPendingBlogsService = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const skip = (page - 1) * limit;

  const blogs = await Blog.find({
    status: "pending",
  })
    .populate("author", "name email")
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit);

  const totalBlogs = await Blog.countDocuments({
    status: "pending",
  });

  return {
    blogs,
    currentPage: page,
    totalPages: Math.ceil(totalBlogs / limit),
    totalBlogs,
  };
};
// Approve Blog
export const approveBlogService = async (blogId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  blog.status = "approved";
  blog.reviewComment = "";
  blog.publishedAt = new Date();

  await blog.save();

  return blog;
};

// Reject Blog
export const rejectBlogService = async (blogId, comment) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  blog.status = "rejected";
  blog.reviewComment = comment || "";

  await blog.save();

  return blog;
};

export const toggleLikeBlogService = async (blogId, userId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const alreadyLiked = blog.likes.some((likeId) => likeId.toString() === userId);

  if (alreadyLiked) {
    blog.likes = blog.likes.filter((likeId) => likeId.toString() !== userId);
  } else {
    blog.likes.push(userId);
  }

  await blog.save();

  return blog;
};

export const addCommentService = async (blogId, userId, comment) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (!comment || !comment.trim()) {
    throw new ApiError(400, "Comment cannot be empty");
  }

  blog.comments.push({ user: userId, comment: comment.trim() });
  await blog.save();

  return blog;
};

export const deleteCommentService = async (blogId, commentId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  blog.comments = blog.comments.filter((entry) => entry._id.toString() !== commentId);
  await blog.save();

  return blog;
};
