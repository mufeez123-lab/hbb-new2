const express = require('express');
const router = express.Router();
const multer = require('multer');
const Brand = require('../models/Brand');
const { adminAuth } = require('../middleware/auth');
const cloudinary = require('../utils/cloudinary'); // ✅ Custom utility for cloudinary

// Use memory storage (no need to save locally)
const storage = multer.memoryStorage();
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
 * @desc    Upload brand image to Cloudinary
 */
router.post('/', adminAuth, upload.single('images'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: 'brands',
        resource_type: 'image',
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return res.status(500).json({ message: 'Image upload failed' });
        }

        const brand = new Brand({
          images: [{ url: result.secure_url, public_id: result.public_id }],
        });

        await brand.save();
        res.status(201).json(brand);
      }
    );

    // Convert buffer stream
    const streamifier = require('streamifier');
    streamifier.createReadStream(req.file.buffer).pipe(result);
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

    // Delete images from Cloudinary
    for (const img of brand.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await brand.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting brand:', err);
    res.status(500).json({ message: 'Failed to delete brand' });
  }
});

module.exports = router;
