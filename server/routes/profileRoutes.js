const express = require('express');
const router = express.Router();
const { upload, handleMulterError } = require('../middleware/upload');
const {
  getAllProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile
} = require('../controllers/profileController');

// Routes
router.get('/', getAllProfiles);
router.get('/:id', getProfile);
router.post('/', upload.single('image'), handleMulterError, createProfile);
router.put('/:id', upload.single('image'), handleMulterError, updateProfile);
router.delete('/:id', deleteProfile);

module.exports = router;