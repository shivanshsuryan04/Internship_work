import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FiArrowLeft,
  FiExternalLink,
  FiGithub,
  FiCalendar,
  FiUsers,
  FiStar,
  FiCheckCircle,
  FiEye,
  FiClock,
  FiTag,
  FiUser,
  FiTrendingUp,
} from "react-icons/fi";

// API service to fetch project data
const API_BASE_URL = "http://localhost:5000/api";

const PortfolioService = {
  getProjectBySlug: async (slug) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/projects/slug/${slug}`);
      return { success: true, data: res.data.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  getRelatedProjects: async (category, excludeId, limit = 3) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/projects`, {
        params: { category, limit },
      });
      // Filter out current project and limit results
      const filtered = res.data.data
        .filter((project) => project._id !== excludeId)
        .slice(0, limit);
      return { success: true, data: filtered };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};

// Loading skeleton component
const ProjectDetailSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-[#020c1b] text-white font-sans">
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
    </div>

    <Header />

    <div className="relative z-10 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back button skeleton */}
        <div className="w-32 h-6 bg-gray-700 rounded mb-8 animate-pulse" />

        {/* Hero section skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="w-24 h-8 bg-gray-700 rounded-full mb-4 animate-pulse" />
            <div className="w-full h-16 bg-gray-700 rounded mb-6 animate-pulse" />
            <div className="w-full h-6 bg-gray-700 rounded mb-4 animate-pulse" />
            <div className="w-3/4 h-6 bg-gray-700 rounded mb-8 animate-pulse" />
            <div className="flex gap-2 mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-8 bg-gray-700 rounded-full animate-pulse"
                />
              ))}
            </div>
            <div className="flex gap-4">
              <div className="w-32 h-12 bg-gray-700 rounded-full animate-pulse" />
              <div className="w-32 h-12 bg-gray-700 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="w-full h-96 bg-gray-700 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

// Motion wrapper component
const MotionWrap = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const PortfolioDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!slug) {
        setError("Project not found");
        setLoading(false);
        return;
      }

      setLoading(true);

      // Fetch main project
      const projectResponse = await PortfolioService.getProjectBySlug(slug);

      if (!projectResponse.success) {
        setError("Project not found");
        setLoading(false);
        return;
      }

      setProject(projectResponse.data);

      // Fetch related projects
      const relatedResponse = await PortfolioService.getRelatedProjects(
        projectResponse.data.category,
        projectResponse.data._id,
        3
      );

      console.log("Related projects response:", relatedResponse);

      if (relatedResponse.success) {
        setRelatedProjects(relatedResponse.data);
      }

      setLoading(false);
    };

    fetchProjectData();
  }, [slug]);

  if (loading) {
    return <ProjectDetailSkeleton />;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-[#020c1b] text-white font-sans">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        </div>

        <Header />

        <div className="relative z-10 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
            <p className="text-gray-300 mb-8">
              The project you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/portfolio")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-300"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-[#020c1b] text-white font-sans">
      {/* Background blur elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <Header />

      {/* Hero Section */}
      <MotionWrap>
        <section className="relative z-10 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => navigate("/resources/portfolio")}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors duration-300 group"
            >
              <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Portfolio
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < project.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-400 ml-2">
                      ({project.rating}/5)
                    </span>
                  </div>
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent leading-tight">
                  {project.name}
                </h1>

                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {project.summary}
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white hover:bg-white/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 hover:scale-105">
                    <FiExternalLink className="w-4 h-4" />
                    View Project
                  </button>
                  <button className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300">
                    <FiGithub className="w-4 h-4" />
                    View Source
                  </button>
                </div>
              </div>

              <MotionWrap delay={0.2}>
                <div className="relative group">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/600x400/1e293b/94a3b8?text=${encodeURIComponent(
                        project.name
                      )}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </MotionWrap>
            </div>
          </div>
        </section>
      </MotionWrap>

      {/* Project Stats */}
      <MotionWrap delay={0.3}>
        <section className="relative z-10 py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              {/* Project Info */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <FiCalendar className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Year</h3>
                </div>
                <p className="text-2xl font-bold text-cyan-400">
                  {project.year}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <FiEye className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-bold text-white">Views</h3>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  {project.views || 0}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <FiUser className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">Client</h3>
                </div>
                <p className="text-xl font-semibold text-purple-400">
                  {project.client || "Personal"}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <FiClock className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-bold text-white">Published</h3>
                </div>
                <p className="text-xl font-medium text-orange-400">
                  {formatDate(project.publishedDate)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </MotionWrap>

      {/* Project Content */}
      <MotionWrap delay={0.4}>
        <section className="relative z-10 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
                  Project Overview
                </h2>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
                  <div
                    className="text-gray-300 leading-relaxed prose prose-lg max-w-none"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {project.content}
                  </div>
                </div>

                {/* Tags Section */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FiTag className="w-5 h-5 text-cyan-400" />
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 text-sm rounded-full font-medium hover:from-cyan-500/30 hover:to-blue-500/30 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Project Details */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Project Details
                  </h3>
                  <div className="space-y-4 text-gray-300">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-sm font-medium">Category:</span>
                      <span className="text-cyan-400 font-semibold">
                        {project.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-sm font-medium">Year:</span>
                      <span className="font-semibold">{project.year}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-sm font-medium">Client:</span>
                      <span className="font-semibold">
                        {project.client || "Personal Project"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-sm font-medium">Views:</span>
                      <span className="font-semibold">
                        {project.views || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rating:</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < project.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Interested in Similar Work?
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Let's discuss how we can bring your ideas to life with
                    cutting-edge technology.
                  </p>
                  <button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-3 rounded-full font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 hover:scale-105">
                    Start a Conversation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </MotionWrap>

      {/* Extra Project Sections */}
      <MotionWrap delay={0.6}>
        <section className="relative z-10 py-16 px-4 space-y-20">
          <div className="max-w-6xl mx-auto space-y-20">
            {/* Challenges & Solutions */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
                Challenges & Solutions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-3">
                    Challenge
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {project.challenge ||
                      "One of the main hurdles was optimizing performance while maintaining design consistency."}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">
                    Solution
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {project.solution ||
                      "Implemented efficient state management and optimized image assets to enhance performance."}
                  </p>
                </div>
              </div>
            </div>

            {/* Development Process */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
                Development Process
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {["Planning", "Design", "Implementation"].map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
                  >
                    <h3 className="text-xl font-semibold text-cyan-400 mb-3">
                      {step}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {project.process?.[idx] ||
                        `Details about ${step.toLowerCase()} phase of the project.`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(
                  project.features || [
                    "User-friendly interface",
                    "Real-time data updates",
                    "Secure authentication",
                    "Responsive design",
                  ]
                ).map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
                  >
                    <span className="flex-shrink-0 w-10 h-10 bg-cyan-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 font-bold">
                      {idx + 1}
                    </span>
                    <p className="text-gray-300 leading-relaxed">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </MotionWrap>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <MotionWrap delay={0.5}>
          <section className="relative z-10 py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center">
                Related Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProjects.map((relatedProject, index) => (
                  <motion.div
                    key={relatedProject._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={`/portfolio/${relatedProject.slug}`}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:scale-105 hover:border-cyan-400/50 transition-all duration-300 group block"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={relatedProject.image}
                          alt={relatedProject.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/400x300/1e293b/94a3b8?text=${encodeURIComponent(
                              relatedProject.name
                            )}`;
                          }}
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-cyan-400 text-xs font-semibold">
                            {relatedProject.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
                          <FiCalendar className="w-3 h-3" />
                          <span>{relatedProject.year}</span>
                          <FiEye className="w-3 h-3 ml-2" />
                          <span>{relatedProject.views || 0}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                          {relatedProject.name}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                          {relatedProject.summary}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {relatedProject.tags
                              .slice(0, 2)
                              .map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 bg-gray-800/50 text-xs text-gray-400 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            {relatedProject.tags.length > 2 && (
                              <span className="px-2 py-1 text-xs text-gray-500">
                                +{relatedProject.tags.length - 2}
                              </span>
                            )}
                          </div>
                          <span className="text-cyan-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                            View →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={() => {
                    navigate("/resources/portfolio");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105"
                >
                  <FiTrendingUp className="w-4 h-4" />
                  View All Projects
                </button>
              </div>
            </div>
          </section>
        </MotionWrap>
      )}

      <Footer />
    </div>
  );
};

export default PortfolioDetailPage;
