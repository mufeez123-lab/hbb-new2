const express = require('express');
const router = express.Router();
const multer = require('multer');
const Brand = require('../models/Brand');
const { adminAuth } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
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
 * @desc    Upload brand images
 */
router.post('/', adminAuth, upload.array('images', 10), async (req, res) => {
  console.log('–– POST /admin/brands called ––');
  console.log('Files:', req.files);
  console.log('Body fields:', req.body);

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    const brand = new Brand({ images: imagePaths });
    await brand.save();

    res.status(201).json(brand);
  } catch (err) {
    console.error('Error saving brand:', err);
    res.status(500).json({ message: err.message || 'Something went wrong!' });
  }
});

/**
 * @route   DELETE /admin/brands/:id
 * @desc    Delete brand and its images
 */
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    for (const img of brand.images) {
      const filePath = path.join(__dirname, '..', img.replace(/^\/+/, ''));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
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
