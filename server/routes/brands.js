const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Brand = require('../models/Brand');
const { adminAuth } = require('../middleware/auth');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary Storage Setup
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
 * @desc    Fetch all brands
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
 * @desc    Upload multiple brand images to Cloudinary (each image = separate brand)
 */
router.post('/', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const savedBrands = [];

    for (const file of req.files) {
      const brand = new Brand({
        images: [{
          url: file.path,
          public_id: file.filename,
        }],
      });
      await brand.save();
      savedBrands.push(brand);
    }

    res.status(201).json(savedBrands);
  } catch (err) {
    console.error('Error uploading brand:', err);
    res.status(500).json({ message: err.message || 'Something went wrong!' });
  }
});

/**
 * @route   DELETE /admin/brands/:id
 * @desc    Delete brand and image from Cloudinary
 */
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

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
