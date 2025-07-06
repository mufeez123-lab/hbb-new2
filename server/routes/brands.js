// routes/admin/brands.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Brand = require('../models/Brand');
const { adminAuth } = require('../middleware/auth');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'brands',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.json(brands);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch brands' });
  }
});

router.post('/', adminAuth, upload.array('images', 10), async (req, res) => {
  console.log('🔹 POST /admin/brands');
  console.log('files:', req.files?.length);
  console.log('req.files:', req.files);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Please upload at least one image.' });
  }

  try {
    const saved = [];
    for (const file of req.files) {
      const { path: url, filename: public_id } = file;
      console.log('Saving brand image:', { url, public_id });

      const brand = new Brand({ image: { url, public_id } });
      await brand.save();
      saved.push(brand);
    }
    res.status(201).json(saved);
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ message: err.message || 'Error saving brand.' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    if (brand.image.public_id) {
      console.log('Deleting from Cloudinary:', brand.image.public_id);
      await cloudinary.uploader.destroy(brand.image.public_id);
    }

    await brand.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: err.message || 'Error deleting brand.' });
  }
});

module.exports = router;
