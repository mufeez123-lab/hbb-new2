const express = require('express');
const router = express.Router();
const HeroSection = require('../models/HeroSection');
const { adminAuth } = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hero',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});
const upload = multer({ storage });

// GET: Fetch hero section
router.get('/', async (req, res) => {
  try {
    const hero = await HeroSection.findOne();
    res.json(hero || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Upload & replace all images
router.post('/', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded.' });
    }

   const newImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
    }));

    // Find existing or create new
    let hero = await HeroSection.findOne();
    if (!hero) {
      hero = new HeroSection({ images: newImages });
    } else {
      hero.images = [...hero.images, ...newImages]; // Append
    }

    await hero.save();

    req.app.get('io')?.emit('hero:updated', hero);

    res.status(201).json(hero);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Remove a specific image by public_id
router.delete('/:public_id', adminAuth, async (req, res) => {
  try {
    const public_id = req.params.public_id;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(public_id);

    // Remove image from MongoDB
    const hero = await HeroSection.findOneAndUpdate(
      {},
      { $pull: { images: { public_id } } },
      { new: true }
    );

    req.app.get('io')?.emit('hero:updated', hero);

    res.json({ message: 'Image deleted successfully', hero });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
