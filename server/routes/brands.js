const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Brand = require('../models/Brand');
const { adminAuth } = require('../middleware/auth');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const router = express.Router();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'brands',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

/**
 * @route GET /admin/brands
 * @desc  Get all brands
 */
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.json(brands);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch brands' });
  }
});

/**
 * @route POST /admin/brands
 * @desc  Upload a single brand image
 */
router.post('/', adminAuth, upload.single('images'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const brand = new Brand({
      image: {
        url: req.file.path,
        public_id: req.file.filename || req.file.originalname,
      },
    });

    await brand.save();
    res.status(201).json(brand);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: err.message || 'Image upload failed' });
  }
});

/**
 * @route DELETE /admin/brands/:id
 * @desc  Delete brand and its image from Cloudinary
 */
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    if (brand.image?.public_id) {
      await cloudinary.uploader.destroy(brand.image.public_id);
    }

    await brand.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: err.message || 'Failed to delete brand' });
  }
});

module.exports = router;
