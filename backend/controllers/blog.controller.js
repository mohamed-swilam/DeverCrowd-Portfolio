const express = require("express");
const Blog = require("../models/blog.schema.js");
const httpResponse = require("../utils/httpResponse.js");
const asyncwrapper = require("../middlewares/asyncWrapper.js");
const errorHandler = require("../utils/errorHandler.js");
const Log = require("../models/log.schema");
const generateUniqueSlug = require("../utils/generateSlug.js");
const sortBlogs = require("../utils/SortingBlogs.js");

const getAllBlogs = asyncwrapper(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 6;
  const page = parseInt(req.query.page, 10) || 1;
  const skip = limit * (page - 1);

  const isAuthenticated = Boolean(req.user);
  const query = isAuthenticated ? {} : { status: "published" };

  const blogs = await Blog.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const sortedBlogs = sortBlogs(blogs);

  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.getAllBlogs,
    data: { blogs: sortedBlogs || [] },
  });
});

const getSingleBlog = asyncwrapper(async (req, res, next) => {
  const slug = req.params.slug;

  const isAuthenticated = Boolean(req.user);

  console.log(slug);
  const blog = await Blog.findOne({ slug });
  if (!blog) {
    const error = errorHandler.create({
      status: httpResponse.status.notfound,
      message: httpResponse.message.blogNotFound,
    });
    return next(error);
  }
  if (!isAuthenticated && blog.status !== "published") {
    const error = errorHandler.create({
      status: httpResponse.status.notfound,
      message: httpResponse.message.blogNotFound,
    });
    return next(error);
  }
  if (
    (!isAuthenticated || req.user.id !== blog.writer_id.toString()) &&
    blog.status === "published"
  ) {
    blog.views = (blog.views || 0) + 1;
  }

  await blog.save();
  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.SingleBlogDetails,
    data: { blog },
  });
});

const createBlog = asyncwrapper(async (req, res, next) => {
  const { title, subtitle, category, status, slug, body, tags } = req.body;

  if (!title || !body) {
    return res.status(400).json({
      status: httpResponse.status.badRequest,
      message: "Title and body are required",
    });
  }

  const blog = new Blog({
    featured_image: req.file ? req.file.path : null,
    title,
    subtitle,
    category,
    body,
    slug: slug || (await generateUniqueSlug(title)),
    writer_name: req.user.username,
    writer_id: req.user.id,
    writer_pic: req.user.pic,
    status:
      status && ["draft", "published"].includes(status) ? status : "draft",
    tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
  });

  
  await blog.save();
  
  const log = new Log({
    user_id: req.user.id,
    log_for: "Blog",
    description: `${blog.title} Created By ${req.user.username}`
  })
  await log.save()
  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.createBlog,
    data: { blog },
  });
});

const modifyBlog = asyncwrapper(async (req, res, next) => {
  const slug = req.params.slug;
  const { title, subtitle, category, tags, body, status } =
    req.body;

  let blog = await Blog.findOne({ slug });

  if (!blog) {
    const error = errorHandler.create({
      status: httpResponse.status.notfound,
      message: httpResponse.message.blogNotFound,
    });
    return next(error);
  }


  const updates = {
    status,
    subtitle,
    category,
    featured_image: req.file ? req.file.path : blog.featured_image,
    tags,
    body,
  };

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      blog[key] = value;
    }
  }
  if (title && title !== blog.title) {
    blog.title = title;
    blog.slug = await generateUniqueSlug(title);
  }
  await blog.save();

  const log = new Log({
    user_id: req.user.id,
    log_for: "Blog",
    description: `${blog.title} Updated By ${req.user.username}`
  })
  await log.save()


  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.blogModified,
    data: { blog },
  });
});

const deleteBlog = asyncwrapper(async (req, res, next) => {
  const slug = req.params.slug;

  let blog = await Blog.findOne({ slug });

  if (!blog) {
    const error = errorHandler.create({
      status: httpResponse.status.notfound,
      message: httpResponse.message.blogNotFound,
    });
    return next(error);
  }

  await blog.deleteOne();
  const log = new Log({
    user_id: req.user.id,
    log_for: "Blog",
    description: `${blog.title} Deleted By ${req.user.username}`
  })
  await log.save()

  res.sendStatus(httpResponse.status.noContent);
});

const addLike = asyncwrapper(async (req, res, next) => {
  const slug = req.params.slug;
  const ip = req.ip;
  const userAgent = req.headers["user-agent"];
  const blog = await Blog.findOne({ slug });
  const userId = req.user ? req.user.id : null;

  if (!blog) {
    const error = errorHandler.create({
      status: httpResponse.status.notfound,
      message: httpResponse.message.blogNotFound,
    });
    return next(error);
  }

  if (blog.status !== "published") {
    const error = errorHandler.create({
      status: httpResponse.status.badrequest,
      message: httpResponse.message.blogNotPublished,
    });
    return next(error);
  }

  const alreadyLiked = blog.likes.some(
    (like) => like.ip === ip || like.userAgent === userAgent,
  );


  if (alreadyLiked) {
    blog.likes = blog.likes.filter(
      (like) => like.ip !== ip && like.userAgent !== userAgent,
    );
    await blog.save();
    res.json({
      status: httpResponse.status.ok,
      message: httpResponse.message.likeRemoved,
      data: { totalLikes: blog.likes.length, liked: false },
    });
    return
  }

  blog.likes.push({ ip, userAgent });
  await blog.save();

  res.json({
    status: httpResponse.status.ok,
    message: httpResponse.message.likeAdded,
    data: { totalLikes: blog.likes.length, liked: true },
  });
});


module.exports = {
  getAllBlogs,
  getSingleBlog,
  createBlog,
  modifyBlog,
  deleteBlog,
  addLike,
};
