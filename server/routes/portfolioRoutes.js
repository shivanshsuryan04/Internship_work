const express = require("express");
const router = express.Router();
const Project = require("../models/Portfolio");

const generateSlug = async (name, excludeId = null) => {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .trim();
  let slug = baseSlug;
  let counter = 1;

  while (
    await Project.findOne({ slug, ...(excludeId && { _id: { $ne: excludeId } }) })
  ) {
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
};

// GET all projects with search and filter functionality
router.get("/", async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const query = { isPublished: true };

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { summary: new RegExp(search, "i") },
        { content: new RegExp(search, "i") },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }
    if (category) query.category = category;

    const skip = (page - 1) * limit;
    const [projects, total] = await Promise.all([
      Project.find(query)
        .sort({ publishedDate: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Project.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: projects,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalProjects: total,
        hasNext: skip + projects.length < total,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET a single project by its slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } }, // Increment views when someone visits the detail page
      { new: true }
    );
    
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET a single project by ID (alternative endpoint)
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST a new project
router.post("/", async (req, res) => {
  try {
    const { name, summary, content, category, tags = [], image, year, client, rating = 5 } = req.body;
    
    // Validate required fields
    if (!name || !summary || !content || !category || !image || !year) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: name, summary, content, category, image, and year are required" 
      });
    }

    const slug = await generateSlug(name);
    const newProject = new Project({
      name,
      slug,
      summary,
      content,
      category,
      tags,
      image,
      year: parseInt(year),
      client: client || "",
      rating: parseInt(rating) || 5,
      views: 0,
      publishedDate: new Date(),
      isPublished: true
    });
    
    await newProject.save();
    res.status(201).json({ success: true, data: newProject });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT (update) a project
router.put("/:id", async (req, res) => {
  try {
    const { name, summary, content, category, tags, image, year, client, rating } = req.body;
    
    // Generate new slug if name has changed
    const updatedData = {
      name,
      summary,
      content,
      category,
      tags: Array.isArray(tags) ? tags : [],
      image,
      year: parseInt(year),
      client: client || "",
      rating: parseInt(rating) || 5,
    };
    
    // Only update slug if name has changed
    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    
    if (existingProject.name !== name) {
      updatedData.slug = await generateSlug(name, req.params.id);
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE a project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET projects by category (for related projects)
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 6, excludeId } = req.query;
    
    const query = { 
      category: category,
      isPublished: true 
    };
    
    // Exclude specific project if provided
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const projects = await Project.find(query)
      .sort({ publishedDate: -1 })
      .limit(parseInt(limit));
    
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET project categories (for filters)
router.get("/meta/categories", async (req, res) => {
  try {
    const categories = await Project.distinct("category", { isPublished: true });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET project stats
router.get("/meta/stats", async (req, res) => {
  try {
    const [totalProjects, totalViews, categories, recentProjects] = await Promise.all([
      Project.countDocuments({ isPublished: true }),
      Project.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
      ]),
      Project.distinct("category", { isPublished: true }),
      Project.find({ isPublished: true })
        .sort({ publishedDate: -1 })
        .limit(5)
        .select("name slug publishedDate views")
    ]);
    
    res.json({
      success: true,
      data: {
        totalProjects,
        totalViews: totalViews[0]?.totalViews || 0,
        totalCategories: categories.length,
        recentProjects
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;