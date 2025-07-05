const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const BoardMember = require('../models/BoardMember');
const { adminAuth } = require('../middleware/auth');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'board',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });
const router = express.Router();

// ==== PUBLIC: Get all active board members ====
router.get('/', async (req, res) => {
  try {
    const members = await BoardMember.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==== ADMIN: Create board member ====
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, position, order } = req.body;

    if (!name || !position || !req.file) {
      return res.status(400).json({ message: 'Please provide all required fields including an image file' });
    }

    const member = new BoardMember({
      name,
      position,
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
      order: order || 0,
    });

    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==== ADMIN: Update board member ====
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, position, order, isActive } = req.body;

    const member = await BoardMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Board member not found' });
    }

    // Delete previous image from Cloudinary if a new image is uploaded
    if (req.file && member.image && member.image.public_id) {
      await cloudinary.uploader.destroy(member.image.public_id);
    }

    member.name = name || member.name;
    member.position = position || member.position;
    member.order = order !== undefined ? order : member.order;
    member.isActive = isActive !== undefined ? isActive : member.isActive;

    if (req.file) {
      member.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await member.save();
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==== ADMIN: Delete board member ====
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const member = await BoardMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Board member not found' });
    }

    // Delete image from Cloudinary
    if (member.image && member.image.public_id) {
      await cloudinary.uploader.destroy(member.image.public_id);
    }

    await member.deleteOne();
    res.json({ message: 'Board member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
