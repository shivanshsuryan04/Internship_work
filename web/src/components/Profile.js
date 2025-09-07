import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiPlus,
  FiEdit2,
  FiMail,
  FiSave,
  FiX,
  FiArrowLeft,
  FiCamera,
  FiTrash2,
} from "react-icons/fi";
import {
  FaUsers,
  FaLaptopCode,
  FaMoneyBillWave,
  FaBullhorn,
  FaProjectDiagram,
  FaChartLine,
} from "react-icons/fa";

const ProfileCard = ({ profile, onEdit, onDelete }) => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:scale-[1.02] transition-all duration-500 group hover:shadow-cyan-500/50 hover:shadow-lg">
    <div className="relative h-32 bg-gradient-to-br from-gray-500 to-blue-600">
      <div className="absolute -bottom-8 left-6">
        <div className="w-20 h-20 rounded-full border-2 border-white overflow-hidden bg-gray-200">
          {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ display: profile.imageUrl ? "none" : "flex" }}
          >
            <FiUser size={24} className="text-gray-400" />
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(profile)}
          className="bg-white/5 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
        >
          <FiEdit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(profile._id)}
          className="bg-white/5 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>

    <div className="pt-12 pb-6 px-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white">{profile.name}</h3>
        <p className="text-gray-400 font-medium">{profile.position}</p>
        {profile.email && (
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <FiMail size={12} />
            {profile.email}
          </p>
        )}
      </div>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{profile.bio}</p>
    </div>
  </div>
);

const ProfileForm = ({
  formData,
  editingProfile,
  loading,
  error,
  imagePreview,
  onInputChange,
  onImageChange,
  onSubmit,
  onCancel,
  onRemoveImage,
}) => (
  <div className="min-h-screen bg-[#020c1b] py-8">
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-500 px-6 py-8">
          <div className="flex items-center gap-4 text-white">
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={loading}
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">
              {editingProfile ? "Edit Profile" : "Add New Profile"}
            </h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser size={48} className="text-gray-400" />
                )}
              </div>
              <label
                htmlFor="image-upload"
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-lg"
              >
                <FiCamera size={16} />
              </label>
              {imagePreview && (
                <button
                  onClick={onRemoveImage}
                  className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  disabled={loading}
                >
                  <FiX size={16} />
                </button>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
                disabled={loading}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Click the camera icon to upload a profile image
              <br />
              <span className="text-xs">(Max 5MB - JPEG, PNG, GIF, WebP)</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Enter full name"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Enter email address"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position *
            </label>
            <input
              type="text"
              name="position"
              autoComplete="off"
              value={formData.position}
              onChange={onInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Enter position"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={onInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-black"
              placeholder="Write a brief bio..."
              disabled={loading}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              onClick={onSubmit}
              disabled={
                loading ||
                !formData.name.trim() ||
                !formData.position.trim() ||
                !formData.email.trim()
              }
              className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {editingProfile ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>
                  <FiSave size={20} />
                  {editingProfile ? "Update Profile" : "Save Profile"}
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiX size={20} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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

const departments = [
  {
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    icon: <FaUsers className="w-8 h-8" />,
    title: "Human Resources",
    description:
      "Fostering a supportive workplace by managing recruitment, employee growth, and organizational culture.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    icon: <FaLaptopCode className="w-8 h-8" />,
    title: "Information Technology",
    description:
      "Driving digital transformation with robust infrastructure, software solutions, and technical support.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1604594849809-dfedbc827105?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    icon: <FaMoneyBillWave className="w-8 h-8" />,
    title: "Finance",
    description:
      "Managing budgets, investments, and financial planning to ensure long-term growth and sustainability.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    icon: <FaBullhorn className="w-8 h-8" />,
    title: "Marketing",
    description:
      "Building strong brand presence with creative campaigns, market research, and customer engagement.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    icon: <FaProjectDiagram className="w-8 h-8" />,
    title: "Project Management",
    description:
      "Ensuring timely delivery of projects with efficient planning, resource allocation, and collaboration.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    icon: <FaChartLine className="w-8 h-8" />,
    title: "Sales",
    description:
      "Boosting business growth by understanding client needs and delivering tailored solutions.",
  },
];

const ProfileList = ({
  profiles,
  loading,
  error,
  onAddProfile,
  onEditProfile,
  onDeleteProfile,
  onClearError,
}) => (
  <div className="min-h-screen bg-[#0A192F] py-8">
    {/* Background Elements */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
    </div>

    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-md mb-6">
            Meet Our <span className="text-blue-500">Team</span>
          </h1>
          <p className="text-xl text-[#D2D0DD] max-w-2xl leading-relaxed">
            Easily manage your team members, view their profiles, update key
            details, and ensure everyone stays connected. A central hub to keep
            your team organized and informed.
          </p>
        </div>

        <button
          onClick={onAddProfile}
          disabled={loading}
          className="bg-white/5 backdrop-blur-sm border border-white/10 text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiPlus size={20} />
          Add New Profile
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={onClearError}
            className="text-red-700 hover:text-red-900 ml-4 text-xl"
          >
            ×
          </button>
        </div>
      )}

      {loading && profiles.length === 0 ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading profiles...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No profiles yet
          </h3>
          <p className="text-gray-400 mb-6">
            Get started by creating your first team profile
          </p>
          <button
            onClick={onAddProfile}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <FiPlus size={20} />
            Add First Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile._id}
              profile={profile}
              onEdit={onEditProfile}
              onDelete={onDeleteProfile}
            />
          ))}
        </div>
      )}
    </div>

    {/* Our Departments */}
    <MotionWrap>
      <section id="departments" className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-bold text-white mb-12 font-inter text-center">
            Our <span className="text-blue-500">Departments</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-shadow"
              >
                {/* Image */}
                <div className="w-full h-40 mb-6 overflow-hidden rounded-xl">
                  <img
                    src={dept.image}
                    alt={dept.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Icon + Title */}
                <div className="flex items-center gap-3 mb-4 text-white">
                  {dept.icon}
                  <h3 className="text-xl font-bold font-inter">{dept.title}</h3>
                </div>

                {/* Description */}
                <p className="text-[#D2D0DD] font-inter leading-relaxed">
                  {dept.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MotionWrap>
    <MotionWrap>
      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6 font-inter">
            Build Stronger Teams, Together
          </h2>
          <p className="text-xl text-[#D2D0DD] mb-8 font-inter">
            Empower your organization with a centralized hub to manage profiles,
            foster collaboration, and keep every department connected and
            aligned.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onAddProfile}
              className="bg-white/5 backdrop-blur-sm border border-white/10 px-8 py-4 rounded-29 text-white font-inter text-lg shadow-glow hover:scale-105 transition-transform"
            >
              Get Started Today
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("departments")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-white/5 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-29 font-inter text-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              Explore Departments
            </button>
          </div>
        </div>
      </section>
    </MotionWrap>
  </div>
);

const ProfileInfo = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentView, setCurrentView] = useState("list");
  const [editingProfile, setEditingProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    position: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/profiles`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setProfiles(data.data || []);
      } else {
        setError(data.message || "Failed to fetch profiles");
      }
    } catch (error) {
      setError(
        "Error connecting to server. Please check if the backend is running."
      );
      console.error("Error fetching profiles:", error);
      // Set empty array for demo purposes
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error && (name === "name" || name === "position" || name === "email")) {
      setError("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        setError(
          "Please select a valid image file (JPEG, JPG, PNG, GIF, WebP)"
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(editingProfile?.imageUrl || null);
    setSelectedImage(null);
    setError("");
    // Reset file input
    const fileInput = document.getElementById("image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async () => {
    // Validation
    const trimmedName = formData.name.trim();
    const trimmedPosition = formData.position.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName || !trimmedPosition || !trimmedEmail) {
      setError(
        "Please fill in all required fields (Name, Email, and Position)"
      );
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }

    if (trimmedPosition.length < 2) {
      setError("Position must be at least 2 characters long");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Create FormData
      const submitData = new FormData();
      submitData.append("name", trimmedName);
      submitData.append("email", trimmedEmail);
      submitData.append("position", trimmedPosition);

      if (formData.bio.trim()) {
        submitData.append("bio", formData.bio.trim());
      }

      if (selectedImage) {
        submitData.append("image", selectedImage);
      }

      const url = editingProfile
        ? `${API_BASE_URL}/profiles/${editingProfile._id}`
        : `${API_BASE_URL}/profiles`;

      const method = editingProfile ? "PUT" : "POST";

      console.log(`Making ${method} request to ${url}`);

      const response = await fetch(url, {
        method: method,
        body: submitData,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.message || `Server error (${response.status})`;

          // Handle specific error cases
          if (errorMessage.toLowerCase().includes("email already exists")) {
            errorMessage = `This email address is already registered. Please use a different email.`;
          } else if (
            errorMessage.toLowerCase().includes("duplicate key") ||
            errorMessage.toLowerCase().includes("duplicate")
          ) {
            errorMessage = `A profile with this information already exists. Please check your email address.`;
          }
        } catch {
          errorMessage = `Server error (${response.status}): ${errorText}`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Success response:", data);

      if (data.success) {
        await fetchProfiles();
        resetForm();
        setCurrentView("list");
      } else {
        setError(data.message || "Error saving profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setError(error.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (profileId) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        await fetchProfiles();
      } else {
        setError(data.message || "Error deleting profile");
      }
    } catch (error) {
      setError("Error connecting to server");
      console.error("Error deleting profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      bio: "",
      position: "",
    });
    setEditingProfile(null);
    setSelectedImage(null);
    setImagePreview(null);
    setError("");

    // Reset file input
    const fileInput = document.getElementById("image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleAddProfile = () => {
    resetForm();
    setCurrentView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditProfile = (profile) => {
    setFormData({
      name: profile.name || "",
      email: profile.email || "",
      bio: profile.bio || "",
      position: profile.position || "",
    });
    setEditingProfile(profile);
    setImagePreview(profile.imageUrl || null);
    setSelectedImage(null);
    setCurrentView("form");
  };

  const handleCancel = () => {
    resetForm();
    setCurrentView("list");
  };

  const handleClearError = () => {
    setError("");
  };

  return (
    <div className="font-sans">
      {currentView === "list" ? (
        <ProfileList
          profiles={profiles}
          loading={loading}
          error={error}
          onAddProfile={handleAddProfile}
          onEditProfile={handleEditProfile}
          onDeleteProfile={handleDeleteProfile}
          onClearError={handleClearError}
        />
      ) : (
        <ProfileForm
          formData={formData}
          editingProfile={editingProfile}
          loading={loading}
          error={error}
          imagePreview={imagePreview}
          onInputChange={handleInputChange}
          onImageChange={handleImageChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onRemoveImage={handleRemoveImage}
        />
      )}
    </div>
  );
};

export default ProfileInfo;
