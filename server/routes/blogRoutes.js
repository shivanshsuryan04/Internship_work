const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");

const generateSlug = async (title, excludeId = null) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .trim();
  let slug = baseSlug;
  let counter = 1;

  while (
    await Blog.findOne({ slug, ...(excludeId && { _id: { $ne: excludeId } }) })
  ) {
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
};

router.get("/", async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const query = { isPublished: true };

    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { content: new RegExp(search, "i") },
        { excerpt: new RegExp(search, "i") },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }
    if (category) query.category = category;

    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ publishedDate: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Blog.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
        hasNext: skip + blogs.length < total,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/slug/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      additionalContent, // Add new field
      category,
      tags = [],
      image,
      additionalImages = [], // Add new field
      author,
    } = req.body;
    if (
      !title ||
      !excerpt ||
      !content ||
      !category ||
      !image ||
      !author?.name ||
      !author?.role ||
      !author?.image
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const slug = await generateSlug(title);
    const blog = new Blog({
      title,
      slug,
      excerpt,
      content,
      additionalContent, // Pass the new field to the model
      category,
      tags,
      image,
      additionalImages, // Pass the new field to the model
      author,
      isPublished: true,
      publishedDate: new Date(),
    });

    const saved = await blog.save();
    res
      .status(201)
      .json({
        success: true,
        data: saved,
        message: "Blog created successfully",
      });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (req.body.title)
      req.body.slug = await generateSlug(req.body.title, req.params.id);
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    res.json({
      success: true,
      data: blog,
      message: "Blog updated successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/like/:id", async (req, res) => {
  try {
    const { action } = req.body;
    if (!["like", "unlike"].includes(action))
      return res
        .status(400)
        .json({
          success: false,
          message: 'Invalid action. Use "like" or "unlike"',
        });

    const increment = action === "like" ? 1 : -1;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: increment } },
      { new: true }
    );

    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    if (blog.likes < 0) {
      blog.likes = 0;
      await blog.save();
    }

    res.json({
      success: true,
      data: { likes: blog.likes },
      message: `Blog ${action}d successfully`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
