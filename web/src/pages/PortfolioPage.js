import React, { useState, useEffect, createContext, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FiExternalLink,
  FiCalendar,
  FiUsers,
  FiStar,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { LuX } from "react-icons/lu";

// Reusing components and logic from BlogPage.js
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

// A simple message box component
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

// API service to handle all data manipulation
const API_BASE_URL = "http://localhost:5000/api";

const PortfolioService = {
  getProjects: async (searchQuery = "", category = "") => {
    try {
      const res = await axios.get(`${API_BASE_URL}/projects`, {
        params: { search: searchQuery, category },
      });
      return { success: true, data: res.data.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  getProjectBySlug: async (slug) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/projects/slug/${slug}`);
      return { success: true, data: res.data.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  createProject: async (projectData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/projects`, projectData);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  editProject: async (id, updatedData) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/projects/${id}`,
        updatedData
      );
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  deleteProject: async (id) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/projects/${id}`);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};

// Modal for creating/editing projects, adapted from BlogPage.js
const EnhancedPortfolioModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  projectToEdit,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    content: "",
    category: "",
    tags: "",
    image: "",
    year: "",
    client: "",
    rating: 5,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        ...projectToEdit,
        tags: Array.isArray(projectToEdit.tags)
          ? projectToEdit.tags.join(", ")
          : projectToEdit.tags || "",
      });
      setImagePreview(projectToEdit.image);
    } else {
      setFormData({
        name: "",
        summary: "",
        content: "",
        category: "",
        tags: "",
        image: "",
        year: "",
        client: "",
        rating: 5,
      });
      setImagePreview(null);
    }
  }, [projectToEdit]);

  const categories = [
    "E-commerce",
    "Healthcare",
    "FinTech",
    "Education",
    "Real Estate",
    "Food & Beverage",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.summary.trim()) newErrors.summary = "Summary is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.image) newErrors.image = "Project image is required";
    if (!formData.year) newErrors.year = "Year is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
      };
      await onSubmit(submitData);
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
            <h2 className="text-2xl font-bold">
              {projectToEdit ? "Edit Project" : "Add New Project"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LuX size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 transition-all"
                placeholder="Enter project name..."
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
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
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 transition-all"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-400 text-sm mt-1">{errors.category}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Summary *
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                rows="3"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 transition-all"
                placeholder="Write a brief summary of the project..."
              />
              {errors.summary && (
                <p className="text-red-400 text-sm mt-1">{errors.summary}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows="5"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 transition-all"
                placeholder="Provide a detailed description of the project..."
              />
              {errors.content && (
                <p className="text-red-400 text-sm mt-1">{errors.content}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 transition-all"
                  placeholder="e.g., 2024"
                />
                {errors.year && (
                  <p className="text-red-400 text-sm mt-1">{errors.year}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Client (optional)
                </label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 transition-all"
                  placeholder="e.g., Tech Solutions Inc."
                />
              </div>
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
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-400 transition-all"
                placeholder="Enter tags separated by commas (e.g., react, node.js)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Image *
              </label>
              <div className="relative border border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center">
                {imagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={imagePreview}
                      alt="Project Preview"
                      className="w-full h-48 object-cover rounded-lg mb-2"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
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
                  onChange={handleFileChange}
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {errors.image && (
                <p className="text-red-400 text-sm mt-1">{errors.image}</p>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : projectToEdit
                  ? "Save Changes"
                  : "Create Project"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ProjectSkeleton = () => (
  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-pulse flex flex-col md:flex-row gap-6">
    {/* Image skeleton */}
    <div className="md:w-1/3 h-48 bg-gray-700 rounded-xl" />

    {/* Content skeleton */}
    <div className="flex-1 flex flex-col justify-between space-y-3">
      <div className="space-y-3">
        <div className="flex gap-4">
          <div className="w-16 h-4 bg-gray-700 rounded" />
          <div className="w-12 h-4 bg-gray-700 rounded" />
          <div className="w-12 h-4 bg-gray-700 rounded" />
        </div>
        <div className="w-2/3 h-6 bg-gray-700 rounded" />
        <div className="w-full h-4 bg-gray-700 rounded" />
        <div className="w-5/6 h-4 bg-gray-700 rounded" />
      </div>
      <div className="flex gap-3 mt-6">
        <div className="flex-1 h-10 bg-gray-700 rounded-full" />
        <div className="flex-1 h-10 bg-gray-700 rounded-full" />
      </div>
    </div>
  </div>
);

const PortfolioPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [message, setMessage] = useState("");

  const categories = [
    "All",
    "E-commerce",
    "Healthcare",
    "FinTech",
    "Education",
    "Real Estate",
    "Food & Beverage",
  ];

  const fetchProjects = async () => {
    setLoading(true);
    const response = await PortfolioService.getProjects(
      searchQuery,
      categoryFilter === "All" ? "" : categoryFilter
    );
    if (response.success) {
      setProjects(response.data);
    } else {
      setMessage("Failed to fetch projects. Please try again later.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [searchQuery, categoryFilter]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
  };

  const handleCreateOrUpdateProject = async (projectData) => {
    let response;
    if (projectToEdit) {
      response = await PortfolioService.editProject(
        projectToEdit._id,
        projectData
      );
    } else {
      response = await PortfolioService.createProject(projectData);
    }

    if (response.success) {
      setMessage(
        `Project ${projectToEdit ? "updated" : "created"} successfully!`
      );
      fetchProjects();
    } else {
      setMessage(
        `Failed to ${projectToEdit ? "update" : "create"} project: ${
          response.error
        }`
      );
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const response = await PortfolioService.deleteProject(id);
      if (response.success) {
        setMessage("Project deleted successfully!");
        fetchProjects();
      } else {
        setMessage(`Failed to delete project: ${response.error}`);
      }
    }
  };

  const handleOpenModal = (project = null) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-[#020c1b] text-white font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      <Header />
      <MotionWrap>
        <section className="relative z-10 max-w-7xl mx-auto px-4 pt-12">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold font-inter mb-6">
              Our <span className="text-blue-500">Work</span>
            </h1>
            <p className="text-xl text-[#D2D0DD] max-w-4xl mx-auto font-inter leading-relaxed mb-12">
              Discover how we've transformed businesses across industries with
              innovative digital solutions that drive real results.
            </p>
          </div>

          {/* Controls Row */}
          <div
            id="portfolio"
            className="flex flex-col lg:flex-row items-center gap-6"
          >
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full py-3 pl-12 pr-6 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative w-full lg:w-60">
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full py-3 pl-6 pr-12 text-white appearance-none focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
              >
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-gray-800 text-white"
                  >
                    {cat}
                  </option>
                ))}
              </select>
              <FiFilter
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>

            {/* Add Project Button */}
            <button
              onClick={() => handleOpenModal()}
              className="w-full lg:w-auto bg-white/10 backdrop-blur-sm border border-white/20 py-3 px-6 rounded-full text-white font-semibold hover:bg-white hover:text-black transition-colors flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Add New Project
            </button>
          </div>
        </section>
      </MotionWrap>

      <MotionWrap>
        <section className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-8">
            <AnimatePresence>
              {loading ? (
                // Show 3 skeleton cards
                [...Array(6)].map((_, i) => <ProjectSkeleton key={i} />)
              ) : projects.length > 0 ? (
                projects.map((project) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300 group cursor-pointer flex flex-col md:flex-row gap-6"
                    onClick={() => navigate(`/portfolio/${project.slug}`)} // Add this click handler
                  >
                    {/* Image on the left */}
                    <div className="relative overflow-hidden rounded-xl md:w-1/3">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/600x400/1e293b/94a3b8?text=Image+Not+Found`;
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-cyan-400 text-sm font-medium">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Content on the right */}
                    <div className="flex-1 flex flex-col justify-between">
                      {/* Top content */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <div className="flex items-center gap-1">
                            <FiCalendar size={14} />
                            <span>{project.year}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaEye size={14} />
                            <span>{project.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiStar size={14} />
                            <span>{project.rating}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                          {project.name}
                        </h3>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-gray-800/50 text-xs text-[#D2D0DD] rounded-full border border-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <p className="text-gray-300 text-sm leading-relaxed">
                          {project.summary}
                        </p>
                      </div>

                      {/* Project Details & CTA */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-[#D2D0DD]">
                          <div className="flex items-center gap-1">
                            <FiCalendar className="w-4 h-4" />
                            {project.year}
                          </div>
                          <div className="flex items-center gap-1">
                            <FiUsers className="w-4 h-4" />
                            {project.client || "Personal"}
                          </div>
                        </div>
                      </div>

                      {/* Bottom actions row */}
                      <div className="flex items-center justify-between mt-6">
                        {/* Left buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              handleOpenModal(project);
                            }}
                            className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium hover:bg-yellow-500/30 transition"
                          >
                            <FaEdit className="inline-block mr-1" /> Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              handleDeleteProject(project._id);
                            }}
                            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-medium hover:bg-red-500/30 transition"
                          >
                            <FaTrash className="inline-block mr-1" /> Delete
                          </button>
                        </div>

                        {/* Right link */}
                        <Link
                          to={`/portfolio/${project.slug}`} // Updated to use slug
                          className="flex items-center gap-1 text-brand-teal hover:text-white transition-colors duration-300 opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()} // Prevent card click
                        >
                          <span className="text-sm font-semibold">
                            View Details
                          </span>
                          <FiExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-400">
                  <p>No projects found. Try adding one!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </MotionWrap>

      <MotionWrap>
        {/* CTA Section */}
        <section className="relative z-10 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6 font-inter">
              Transforming Ideas into Impactful Portfolios
            </h2>
            <p className="text-xl text-[#D2D0DD] mb-8 font-inter">
              Showcase your best work in one place. Highlight achievements,
              inspire trust, and create a lasting impression with every project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleOpenModal}
                className="bg-white/5 backdrop-blur-sm border border-white/10 px-8 py-4 rounded-29 text-white font-inter text-lg shadow-glow hover:scale-105 transition-transform"
              >
                Get Started Today
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("portfolio")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-white/5 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-29 font-inter text-lg hover:bg-white hover:text-gray-900 transition-colors"
              >
                Explore Project
              </button>
            </div>
          </div>
        </section>
      </MotionWrap>

      <AnimatePresence>
        {message && (
          <MessageBox message={message} onClose={() => setMessage("")} />
        )}
      </AnimatePresence>
      <EnhancedPortfolioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdateProject}
        projectToEdit={projectToEdit}
      />
      <Footer />
    </div>
  );
};

export default PortfolioPage;
