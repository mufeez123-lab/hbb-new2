const express = require('express');
const router = express.Router();
const HeroSection = require('../models/HeroSection');
const { adminAuth } = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for Hero Image
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hero',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

// GET hero section
router.get('/', async (req, res) => {
  try {
    const hero = await HeroSection.findOne();
    res.json(hero || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update or insert hero image
router.put('/', adminAuth, upload.single('backgroundImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded.' });
    }

    const { path: url, filename: public_id } = req.file;

    const updateData = {
      backgroundImage: { url, public_id }
    };

    const hero = await HeroSection.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true
    });

    req.app.get('io').emit('hero:updated', hero);

    res.json(hero);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
