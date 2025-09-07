import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaEye,
  FaHeart,
  FaArrowLeft,
  FaClock,
  FaBookmark,
  FaTag,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { HiSparkles, HiShare } from "react-icons/hi";
import { LuX } from "react-icons/lu";

const RouterContext = createContext();

const Router = ({ children }) => {
  const [path, setPath] = useState(window.location.hash || "#/blogs");
  const [params, setParams] = useState({});

  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash || "#/blogs";
      setPath(newHash);
      const pathParts = newHash.split("/");
      if (pathParts.length > 2) {
        setParams({ slug: pathParts[2] });
      } else {
        setParams({});
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (newPath) => {
    window.location.hash = newPath;
  };

  return (
    <RouterContext.Provider value={{ path, params, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

const useRouter = () => useContext(RouterContext);

// Mock API service to handle all data manipulation
const API_BASE_URL = "http://localhost:5000/api";

const BlogService = {
  getBlogs: async (searchQuery = "", category = "") => {
    try {
      const res = await axios.get(`${API_BASE_URL}/blogs`, {
        params: { search: searchQuery, category },
      });
      return { success: true, data: res.data.data }; // return only blog array
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  getBlogBySlug: async (slug) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/blogs/slug/${slug}`);
      return { success: true, data: res.data.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  toggleLike: async (id, action) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/blogs/like/${id}`, {
        action,
      });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  createBlog: async (blogData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/blogs`, blogData);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  editBlog: async (id, updatedData) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/blogs/${id}`, updatedData);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  deleteBlog: async (id) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/blogs/${id}`);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};

// A simple message box component to replace `alert()`
const MessageBox = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div className="bg-gray-800 text-white p-6 rounded-xl shadow-2xl border border-gray-700 max-w-sm w-full text-center">
          <p className="text-lg font-medium mb-4">{message}</p>
          <button
            onClick={onClose}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            OK
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const MotionWrap = ({ children }) => (
  <motion.div
    variants={sectionVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
  >
    {children}
  </motion.div>
);

const BlogCard = ({ blog, onLike, onEdit, onDelete }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(blog.likes || 0);

  const handleLike = async (e) => {
    e.stopPropagation();
    const action = isLiked ? "unlike" : "like";
    const response = await BlogService.toggleLike(blog._id, action);

    if (response.success) {
      setLikes(response.data.likes);
      setIsLiked(!isLiked);
    }
  };

  return (
    <motion.a
      href={`#/blogs/${blog.slug}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300 group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          // Add an onerror handler for image fallback
          onError={(e) => {
            e.target.onerror = null; // prevents infinite loop
            e.target.src = `https://placehold.co/600x400/1e293b/94a3b8?text=Image+Not+Found`;
          }}
        />
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-cyan-400 text-sm font-medium">
            {blog.category}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <FaCalendarAlt size={14} />
            <span>{new Date(blog.publishedDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaEye size={14} />
            <span>{blog.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaClock size={14} />
            <span>{blog.readTime} min read</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
          {blog.title}
        </h3>

        <p className="text-gray-300 text-sm leading-relaxed">{blog.excerpt}</p>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            <img
              src={blog.author.image}
              alt={blog.author.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-white text-sm font-medium">
                {blog.author.name}
              </p>
              <p className="text-gray-400 text-xs">{blog.author.role}</p>
            </div>
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors duration-300 ${
              isLiked
                ? "bg-red-500/20 text-red-400"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            <FaHeart size={14} className={isLiked ? "fill-current" : ""} />
            <span className="text-xs">{likes}</span>
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={(e) => {
              e.preventDefault(); // prevent navigation
              onEdit(blog);
            }}
            className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(blog._id);
            }}
            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.a>
  );
};

const EnhancedBlogModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  blogToEdit,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    additionalContent: "", // New state for additional content
    category: "",
    tags: "",
    image: "",
    additionalImages: [], // New state for additional images
    author: {
      name: "",
      role: "",
      image: "",
      email: "",
    },
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [authorImagePreview, setAuthorImagePreview] = useState(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (blogToEdit) {
      setFormData({
        ...blogToEdit,
        tags: Array.isArray(blogToEdit.tags)
          ? blogToEdit.tags.join(", ")
          : blogToEdit.tags || "",
      });
      setImagePreview(blogToEdit.image);
      setAuthorImagePreview(blogToEdit.author.image);
    }
  }, [blogToEdit]);

  const categories = [
    "Technology",
    "Marketing",
    "Business",
    "Design",
    "Development",
    "AI",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("author.")) {
      const authorField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        author: { ...prev.author, [authorField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = (fieldName, index) => {
    if (fieldName === "image") {
      setFormData((prev) => ({ ...prev, image: "" }));
      setImagePreview(null);
    } else if (fieldName === "author.image") {
      setFormData((prev) => ({
        ...prev,
        author: { ...prev.author, image: "" },
      }));
      setAuthorImagePreview(null);
    } else if (fieldName === "additionalImages") {
      setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
      setFormData((prev) => ({
        ...prev,
        additionalImages: prev.additionalImages.filter((_, i) => i !== index),
      }));
    }
  };

  // This function handles image file input change and creates a data URL
  // Inside EnhancedBlogModal
  const handleFileChange = (e, fieldName) => {
    const files = e.target.files;
    if (files) {
      if (fieldName === "image") {
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, image: reader.result }));
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (fieldName === "author.image") {
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            author: { ...prev.author, image: reader.result },
          }));
          setAuthorImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (fieldName === "additionalImages") {
        // Handle multiple additional images
        const newImagePreviews = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData((prev) => ({
              ...prev,
              additionalImages: [...prev.additionalImages, reader.result],
            }));
            newImagePreviews.push(reader.result);
            if (newImagePreviews.length === files.length) {
              setAdditionalImagePreviews((prev) => [
                ...prev,
                ...newImagePreviews,
              ]);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.excerpt.trim()) newErrors.excerpt = "Excerpt is required";
      if (!formData.category) newErrors.category = "Category is required";
    } else if (stepNumber === 2) {
      if (!formData.image) newErrors.image = "Blog cover image is required";
      if (!formData.author.name.trim())
        newErrors["author.name"] = "Author name is required";
      if (!formData.author.role.trim())
        newErrors["author.role"] = "Author role is required";
      if (!formData.author.image)
        newErrors["author.image"] = "Author image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(2)) {
      const submitData = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
        content: formData.content, // Now uses the correct content from state
      };
      await onSubmit(submitData);
      // Reset form after submission
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        additionalContent: "", // Reset additional content
        category: "",
        tags: "",
        image: "",
        additionalImages: [], // Reset additional images
        author: { name: "", role: "", image: "", email: "" },
      });
      setImagePreview(null);
      setAuthorImagePreview(null);
      setStep(1);
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg">
                <HiSparkles size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Create New Blog</h2>
                <p className="text-gray-400 text-sm">Step {step} of 2</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LuX size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-4 h-4 rounded-full ${
                  step >= 1 ? "bg-cyan-400" : "bg-gray-600"
                }`}
              />
              <div
                className={`flex-1 h-1 ${
                  step >= 2 ? "bg-cyan-400" : "bg-gray-600"
                } rounded`}
              />
              <div
                className={`w-4 h-4 rounded-full ${
                  step >= 2 ? "bg-cyan-400" : "bg-gray-600"
                }`}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Basic Info</span>
              <span>Media & Author</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    placeholder="Enter an engaging blog title..."
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    placeholder="Write a compelling excerpt that summarizes your blog..."
                  />
                  {errors.excerpt && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.excerpt}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content (optional)
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    placeholder="Write content for your blog here..."
                  />
                  {errors.content && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.content}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (optional)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    placeholder="Enter tags separated by commas (e.g., react, javascript)"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Blog Cover Image *
                  </label>

                  <div className="relative border border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center">
                    {imagePreview ? (
                      <div className="relative w-full">
                        <img
                          src={imagePreview}
                          alt="Blog Preview"
                          className="w-full h-48 object-cover rounded-lg mb-2"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("image")}
                          className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-red-500"
                        >
                          <LuX size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <FaPlus size={32} className="mx-auto mb-2" />
                        <p>Drag & drop an image or click to upload</p>
                      </div>
                    )}
                    <input
                      type="file"
                      name="image"
                      onChange={(e) => handleFileChange(e, "image")}
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  {errors.image && (
                    <p className="text-red-400 text-sm mt-1">{errors.image}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      name="author.name"
                      value={formData.author.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                    {errors["author.name"] && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors["author.name"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Author Role *
                    </label>
                    <input
                      type="text"
                      name="author.role"
                      value={formData.author.role}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      placeholder="Software Engineer"
                    />
                    {errors["author.role"] && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors["author.role"]}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Author Image *
                  </label>
                  <div className="relative border border-dashed border-gray-600 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                    {authorImagePreview ? (
                      <div className="relative w-24 h-24">
                        <img
                          src={authorImagePreview}
                          alt="Author Preview"
                          className="w-full h-full object-cover rounded-full"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("author.image")}
                          className="absolute -top-2 -right-2 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full"
                        >
                          <LuX size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <FaPlus size={20} className="mx-auto" />
                      </div>
                    )}
                    <input
                      type="file"
                      name="author.image"
                      onChange={(e) => handleFileChange(e, "author.image")}
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  {errors["author.image"] && (
                    <p className="text-red-400 text-sm mt-1 text-center">
                      {errors["author.image"]}
                    </p>
                  )}
                </div>
                {/* New field for additional content */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Content (optional)
                  </label>
                  <textarea
                    name="additionalContent"
                    value={formData.additionalContent}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    placeholder="Add more details or a second section to your blog post..."
                  />
                </div>

                {/* New field for additional images */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Images (optional)
                  </label>
                  <div className="relative border border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center">
                    <div className="flex flex-wrap gap-4 mb-4">
                      {additionalImagePreviews.map((imgSrc, index) => (
                        <div key={index} className="relative w-24 h-24">
                          <img
                            src={imgSrc}
                            alt={`Additional Image ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveImage("additionalImages", index)
                            }
                            className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-red-500"
                          >
                            <LuX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="text-center text-gray-400">
                      <FaPlus size={32} className="mx-auto mb-2" />
                      <p>Drag & drop images or click to upload</p>
                    </div>
                    <input
                      type="file"
                      name="additionalImages"
                      onChange={(e) => handleFileChange(e, "additionalImages")}
                      accept="image/*"
                      multiple
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Author Email (optional)
                  </label>
                  <input
                    type="email"
                    name="author.email"
                    value={formData.author.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div className="flex justify-between gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex items-center gap-2 bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className={`flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:from-cyan-500 hover:to-blue-600"
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Create Blog"}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const LoadingSkeleton = () => (
  <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
      >
        <div className="h-48 bg-gray-600 rounded-xl mb-4" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-600 rounded w-3/4" />
          <div className="h-4 bg-gray-600 rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-600 rounded" />
            <div className="h-4 bg-gray-600 rounded w-5/6" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const BlogPage = () => {
  const { navigate } = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [message, setMessage] = useState("");
  const [editingBlog, setEditingBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [searchQuery, categoryFilter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await BlogService.getBlogs(searchQuery, categoryFilter);
      if (response.success) {
        setBlogs(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("Failed to load blogs. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlog = async (newBlogData) => {
    setIsSubmitting(true);

    if (editingBlog) {
      // 👇 when editing
      const response = await BlogService.editBlog(editingBlog._id, newBlogData);
      if (response.success) {
        setMessage("Blog updated successfully!");
      } else {
        setMessage("Failed to update blog.");
      }
      setEditingBlog(null); // reset edit mode
    } else {
      // 👇 when creating
      const response = await BlogService.createBlog(newBlogData);
      if (response.success) {
        setMessage("Blog created successfully!");
      } else {
        setMessage("Failed to create blog.");
      }
    }

    fetchBlogs();
    setIsSubmitting(false);
    setModalOpen(false);
  };

  const handleEdit = (blog) => {
    setModalOpen(true);
    setEditingBlog(blog);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      const response = await BlogService.deleteBlog(id);
      if (response.success) {
        setMessage("Blog deleted successfully!");
        fetchBlogs();
      } else {
        setMessage("Failed to delete blog.");
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (cat) => {
    setCategoryFilter((prev) => (prev === cat ? "" : cat));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-[#020c1b] text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const categories = ["Technology", "Marketing", "Business", "Design", "AI"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-[#020c1b] text-white font-sans">
      <Header />

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <MotionWrap>
          <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-6 mb-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                Our Latest <span className="text-blue-500">Blog</span>
              </h1>
              <p className="text-gray-300 text-lg max-w-xl">
                Explore the dynamic realm of web development, design, and
                technology where creativity meets innovation. Stay ahead with
                insights, tips, and trends shaping the digital future.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-white/5 backdrop-blur-sm border border-white/10 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
            >
              <FaPlus size={20} />
              Create Blog
            </button>
          </div>
        </MotionWrap>

        <MotionWrap>
          {/* Search and Filter */}
          <div
            id="blog-section"
            className="flex flex-col md:flex-row items-center gap-4 mb-10"
          >
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-white/10 backdrop-blur-sm rounded-lg py-3 pl-12 pr-4 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />
              <FaSearch
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <FaFilter size={20} className="text-gray-400" />
              <span className="text-gray-300">Filter by:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    categoryFilter === cat
                      ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </MotionWrap>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onEdit={() => handleEdit(blog)}
                  onDelete={() => handleDelete(blog._id)}
                />
              ))
            ) : (
              <div className="md:col-span-3 text-center py-20 text-gray-400 text-lg">
                No blogs found.
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Modal for creating a new blog */}
      <EnhancedBlogModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddBlog}
        isSubmitting={isSubmitting}
      />

      {/* Message box */}
      <AnimatePresence>
        {message && (
          <MessageBox message={message} onClose={() => setMessage("")} />
        )}
      </AnimatePresence>
      {/* CTA Section */}
      <MotionWrap>
        <section className="relative z-10 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6 font-inter">
              Share Your Ideas with the World
            </h2>
            <p className="text-xl text-[#D2D0DD] mb-8 font-inter">
              Discover inspiring stories, explore diverse topics, and contribute
              your own voice to our growing community of writers and readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setModalOpen(true)}
                className="bg-white/5 backdrop-blur-sm border border-white/10 px-8 py-4 rounded-29 text-white font-inter text-lg shadow-glow hover:scale-105 transition-transform"
              >
                Write a Blog
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("blog-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-white/5 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-29 font-inter text-lg hover:bg-white hover:text-gray-900 transition-colors"
              >
                Explore Blogs
              </button>
            </div>
          </div>
        </section>
      </MotionWrap>

      <Footer />
    </div>
  );
};

const BlogDetailLoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="max-w-3xl mx-auto">
      <div className="h-64 md:h-96 bg-gray-600 rounded-2xl mb-8" />
      <div className="space-y-4">
        <div className="h-8 bg-gray-600 rounded w-3/4" />
        <div className="h-4 bg-gray-600 rounded w-1/2" />
        <div className="space-y-2 mt-6">
          <div className="h-4 bg-gray-600 rounded" />
          <div className="h-4 bg-gray-600 rounded" />
          <div className="h-4 bg-gray-600 rounded w-5/6" />
        </div>
      </div>
    </div>
  </div>
);

const BlogDetailPage = () => {
  const { params, navigate } = useRouter();
  const { slug } = params;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readProgress, setReadProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      fetchBlogBySlug(slug);
    }

    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.pageYOffset / totalHeight) * 100;
        setReadProgress(Math.min(progress, 100));
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [slug]);

  const fetchBlogBySlug = async (currentSlug) => {
    try {
      setLoading(true);
      setError(null);

      const response = await BlogService.getBlogBySlug(currentSlug);

      if (response.success) {
        setBlog(response.data);
        setLikes(response.data.likes || 0);

        // Check for bookmark status on load
        const bookmarks = JSON.parse(
          localStorage.getItem("bookmarkedBlogs") || "[]"
        );
        setIsBookmarked(bookmarks.includes(response.data._id));
      } else {
        setError("Blog not found");
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!blog) return;

    const action = isLiked ? "unlike" : "like";
    const response = await BlogService.toggleLike(blog._id, action);

    if (response.success) {
      setLikes(response.data.likes);
      setIsLiked(!isLiked);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    // Use document.execCommand('copy') for better compatibility in iframes
    const el = document.createElement("textarea");
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setMessage("Link copied to clipboard!");
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => {
      const newIsBookmarked = !prev;
      const bookmarks = JSON.parse(
        localStorage.getItem("bookmarkedBlogs") || "[]"
      );
      if (newIsBookmarked) {
        const updated = [...bookmarks, blog._id];
        localStorage.setItem("bookmarkedBlogs", JSON.stringify(updated));
      } else {
        const updated = bookmarks.filter((id) => id !== blog._id);
        localStorage.setItem("bookmarkedBlogs", JSON.stringify(updated));
      }
      return newIsBookmarked;
    });
    setMessage(
      isBookmarked ? "Removed from bookmarks." : "Added to bookmarks!"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-[#020c1b] text-white">
        <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-0" />
        </div>
        <div className="max-w-4xl mx-auto px-4 py-20">
          <BlogDetailLoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-[#020c1b] text-white flex items-center justify-center">
        <div className="text-center p-6 rounded-xl border border-white/10 bg-white/5">
          <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
          <p className="text-gray-400 mb-8">
            {error || "The blog you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("#/blogs")}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-[#020c1b] text-white font-sans">
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <nav className="relative z-10 px-4 py-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate("#/blogs")}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <FaArrowLeft size={20} />
            <span className="hidden sm:inline">Back to blogs</span>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isLiked
                  ? "bg-red-500/20 text-red-400"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              <FaHeart size={18} className={isLiked ? "fill-current" : ""} />
              <span>{likes}</span>
            </button>
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isBookmarked
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              <FaBookmark
                size={18}
                className={isBookmarked ? "fill-current" : ""}
              />
              <span>Bookmark</span>
            </button>
          </div>
        </div>
      </nav>

      <article className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 overflow-hidden rounded-2xl shadow-xl border border-white/20">
          <motion.img
            src={blog.image}
            alt={blog.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-80 md:h-[400px] object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/1200x800/1e293b/94a3b8?text=Image+Not+Found";
            }}
          />
        </div>
        <div className="p-6 md:p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-6 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <FaCalendarAlt size={16} />
              <span>{new Date(blog.publishedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEye size={16} />
              <span>{blog.views} views</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock size={16} />
              <span>{blog.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <FaTag size={16} />
              <span className="text-cyan-400 font-medium">{blog.category}</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight"
          >
            {blog.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 border-t border-b border-white/10 py-4"
          >
            <img
              src={blog.author.image}
              alt={blog.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="text-white text-lg font-bold">{blog.author.name}</p>
              <p className="text-gray-400 text-sm">{blog.author.role}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="prose prose-invert prose-lg max-w-none text-gray-300"
          >
            <p className="lead text-xl">{blog.excerpt}</p>
            <p className="py-4 text-gray-400">{blog.content}</p>

            {blog.additionalImages && blog.additionalImages.length > 0 && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blog.additionalImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Additional image ${index + 1}`}
                    className="w-full h-auto object-cover rounded-xl shadow-lg"
                  />
                ))}
              </div>
            )}

            {blog.additionalContent && (
              <div className="mt-8 prose prose-lg dark:prose-invert">
                <p>{blog.additionalContent}</p>
              </div>
            )}
          </motion.div>

          {blog.tags && blog.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-2 pt-4 border-t border-white/10"
            >
              <span className="text-gray-400">Tags:</span>
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
          >
            <span className="text-gray-400">Enjoyed this article?</span>
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isLiked
                  ? "bg-red-500/20 text-red-400"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              <FaHeart size={18} className={isLiked ? "fill-current" : ""} />
              <span>{isLiked ? "Liked!" : "Like it"}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all"
            >
              <HiShare size={18} />
              <span>Share</span>
            </button>
          </motion.div>
        </div>
      </article>

      <article className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[20px] p-6">
          <h3 className="text-3xl font-bold text-white mb-4 font-inter">
            Stay Updated
          </h3>
          <p className="text-[#D2D0DD] text-sm mb-4">
            Get the latest articles delivered to your inbox.
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-[#D2D0DD] text-sm focus:outline-none focus:border-brand-teal transition-colors"
            />
            <button className="w-full bg-white/5 backdrop-blur-sm border border-white/10 py-2 px-4 rounded-lg text-white font-semibold text-sm hover:bg-white hover:text-black transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </article>

      <AnimatePresence>
        {message && (
          <MessageBox message={message} onClose={() => setMessage("")} />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

const App = () => {
  const { path } = useRouter();

  let content;
  if (path.startsWith("#/blogs/")) {
    content = <BlogDetailPage />;
  } else {
    content = <BlogPage />;
  }

  return (
    <>
      <style>
        {`
                body {
                    font-family: 'Inter', sans-serif;
                }
                .prose img {
                    border-radius: 0.75rem;
                }
                `}
      </style>
      {content}
    </>
  );
};

export default () => (
  <Router>
    <App />
  </Router>
);
