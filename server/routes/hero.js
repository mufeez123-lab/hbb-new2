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

// DELETE: Remove a specific image by image _id
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const hero = await HeroSection.findOne();
    if (!hero) return res.status(404).json({ message: 'Hero section not found' });

    // Find the image inside the images array
    const imageToDelete = hero.images.find(img => img._id.equals(req.params.id));
    if (!imageToDelete) return res.status(404).json({ message: 'Image not found' });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(imageToDelete.public_id);

    // Remove from the array
    hero.images = hero.images.filter(img => !img._id.equals(req.params.id));
    await hero.save();

    res.json({ message: 'Deleted successfully', images: hero.images });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
