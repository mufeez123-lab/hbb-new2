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
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const imageDoc = await HeroSection.findById(req.params.id);
    if (!imageDoc) return res.status(404).json({ message: 'Image not found' });

    await cloudinary.uploader.destroy(imageDoc.image.public_id);
    await imageDoc.deleteOne();

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
