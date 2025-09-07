// Enhanced Portfolio.js model with better validation and features

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [100, "Project name cannot exceed 100 characters"]
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true, // Add index for better query performance
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: {
        values: ["E-commerce", "Healthcare", "FinTech", "Education", "Real Estate", "Food & Beverage", "Government", "Marketing", "Gaming", "Other"],
        message: "Category must be one of the predefined options"
      }
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [30, "Tag cannot exceed 30 characters"]
      },
    ],
    image: {
      type: String,
      required: [true, "Project image is required"],
      validate: {
        validator: function(v) {
          // Basic URL or base64 validation
          return /^(https?:\/\/|data:image\/)/.test(v);
        },
        message: "Image must be a valid URL or base64 string"
      }
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      trim: true,
      maxlength: [500, "Summary cannot exceed 500 characters"]
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [10000, "Content cannot exceed 10,000 characters"]
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [2000, "Year must be 2000 or later"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"]
    },
    client: {
      type: String,
      trim: true,
      maxlength: [100, "Client name cannot exceed 100 characters"],
      default: ""
    },
    rating: {
      type: Number,
      default: 5,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"]
    },
    views: {
      type: Number,
      default: 0,
      min: [0, "Views cannot be negative"]
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    // Additional fields for better project management
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    liveUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Optional field
          return /^https?:\/\//.test(v);
        },
        message: "Live URL must be a valid HTTP/HTTPS URL"
      }
    },
    githubUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Optional field
          return /^https?:\/\/github\.com\//.test(v);
        },
        message: "GitHub URL must be a valid GitHub repository URL"
      }
    },
    technologies: [
      {
        name: String,
        category: {
          type: String,
          enum: ["Frontend", "Backend", "Database", "DevOps", "Mobile", "Other"]
        }
      }
    ],
    status: {
      type: String,
      enum: ["Planning", "In Progress", "Completed", "Maintenance"],
      default: "Completed"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
projectSchema.index({ category: 1, isPublished: 1 });
projectSchema.index({ publishedDate: -1 });
projectSchema.index({ featured: 1, isPublished: 1 });
projectSchema.index({ year: -1 });

// Virtual for formatted date
projectSchema.virtual('formattedDate').get(function() {
  return this.publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for reading time estimation
projectSchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(' ').length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
});

// Pre-save middleware to generate a URL-friendly slug from the project name
projectSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("name")) {
    const baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .trim();
    
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure unique slug
    while (await mongoose.model('Project').findOne({ 
      slug, 
      _id: { $ne: this._id } 
    })) {
      slug = `${baseSlug}-${counter++}`;
    }
    
    this.slug = slug;
  }
  
  // Ensure tags are unique and clean
  if (this.tags && this.tags.length > 0) {
    this.tags = [...new Set(this.tags.map(tag => tag.toLowerCase().trim()))];
  }
  
  next();
});

// Static method to get featured projects
projectSchema.statics.getFeatured = function(limit = 3) {
  return this.find({ featured: true, isPublished: true })
    .sort({ publishedDate: -1 })
    .limit(limit);
};

// Static method to get projects by category
projectSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({ category, isPublished: true })
    .sort({ publishedDate: -1 })
    .limit(limit);
};

// Static method to search projects
projectSchema.statics.search = function(query) {
  return this.find({
    $and: [
      { isPublished: true },
      {
        $or: [
          { name: new RegExp(query, "i") },
          { summary: new RegExp(query, "i") },
          { content: new RegExp(query, "i") },
          { tags: { $in: [new RegExp(query, "i")] } }
        ]
      }
    ]
  }).sort({ publishedDate: -1 });
};

// Instance method to increment views
projectSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;