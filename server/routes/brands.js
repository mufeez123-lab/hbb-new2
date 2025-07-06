const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Brand = require('../models/Brand');
const { adminAuth } = require('../middleware/auth');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer-cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'brands',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

/**
 * @route   GET /admin/brands
 * @desc    Get all brands
 */
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    console.error('Error fetching brands:', err);
    res.status(500).json({ message: 'Failed to fetch brands' });
  }
});

/**
 * @route   POST /admin/brands
 * @desc    Upload multiple brand images to Cloudinary
 */
router.post('/', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const imageData = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
    }));

    const brand = new Brand({ images: imageData });
    await brand.save();

    res.status(201).json(brand);
  } catch (err) {
    console.error('Error uploading brand:', err);
    res.status(500).json({ message: err.message || 'Something went wrong!' });
  }
});

/**
 * @route   DELETE /admin/brands/:id
 * @desc    Delete brand and images from Cloudinary
 */
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Delete each image from Cloudinary
    for (const img of brand.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await brand.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting brand:', err);
    res.status(500).json({ message: 'Failed to delete brand' });
  }
});

module.exports = router;
