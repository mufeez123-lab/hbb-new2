const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const HeroSection = require('../models/HeroSection');
const multer = require('multer');
const path = require('path');

// Configure multer for background image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/hero'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get hero section
router.get('/', async (req, res) => {
  try {
    const hero = await HeroSection.findOne();
    res.json(hero || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update hero section
router.put('/', adminAuth, upload.single('backgroundImage'), async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      buttonText,
      buttonLink
    } = req.body;

    const updateData = {
      title,
      subtitle,
      description,
      buttonText,
      buttonLink
    };

    if (req.file) {
      updateData.backgroundImage = `/uploads/hero/${req.file.filename}`;
    }

    const hero = await HeroSection.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true }
    );

    // Emit real-time update
    req.app.get('io').emit('hero:updated', hero);

    res.json(hero);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 