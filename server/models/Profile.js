const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters']
  },
  image: {
    type: String, // This will store the filename of uploaded image
    default: null
  }
}, {
  timestamps: true
});

// Create a virtual field for full image URL
profileSchema.virtual('imageUrl').get(function() {
  if (this.image) {
    const baseUrl = process.env.SERVER_URL || 'http://localhost:5000';
    return `${baseUrl}/uploads/${this.image}`;
  }
  return null;
});

// Transform function to include imageUrl in JSON responses
profileSchema.methods.toJSON = function() {
  const profile = this.toObject();
  if (profile.image) {
    const baseUrl = process.env.SERVER_URL || 'http://localhost:5000';
    profile.imageUrl = `${baseUrl}/uploads/${profile.image}`;
  }
  return profile;
};

module.exports = mongoose.model('Profile', profileSchema);