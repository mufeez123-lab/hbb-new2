const express = require('express');
const router = express.Router();
const HeroSection = require('../models/HeroSection');
const { adminAuth } = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hero',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const hero = await HeroSection.findOne() || { desktopImages: [], mobileImages: [] };
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/desktop', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded.' });
    }

    const newImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
    }));

    let hero = await HeroSection.findOne();
    if (!hero) {
      hero = new HeroSection({ desktopImages: newImages });
    } else {
      hero.desktopImages = [...hero.desktopImages, ...newImages];
    }

    await hero.save();
    req.app.get('io')?.emit('hero:updated', hero);
    res.status(201).json({ images: hero.desktopImages });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/mobile', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded.' });
    }

    const newImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
    }));

    let hero = await HeroSection.findOne();
    if (!hero) {
      hero = new HeroSection({ mobileImages: newImages });
    } else {
      hero.mobileImages = [...hero.mobileImages, ...newImages];
    }

    await hero.save();
    req.app.get('io')?.emit('hero:updated', hero);
    res.status(201).json({ images: hero.mobileImages });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:type/:id', adminAuth, async (req, res) => {
  try {
    const { type, id } = req.params;
    const hero = await HeroSection.findOne();
    if (!hero) return res.status(404).json({ message: 'Hero section not found' });

    let targetArray;
    if (type === 'desktop') {
      targetArray = 'desktopImages';
    } else if (type === 'mobile') {
      targetArray = 'mobileImages';
    } else {
      return res.status(400).json({ message: 'Invalid image type.' });
    }

    const imageToDelete = hero[targetArray].find(img => img._id.equals(id));
    if (!imageToDelete) return res.status(404).json({ message: 'Image not found' });

    await cloudinary.uploader.destroy(imageToDelete.public_id);

    hero[targetArray] = hero[targetArray].filter(img => !img._id.equals(id));
    await hero.save();

    res.json({ message: 'Deleted successfully', images: hero[targetArray] });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;