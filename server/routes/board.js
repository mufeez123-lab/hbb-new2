const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const BoardMember = require('../models/BoardMember');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ==== Multer Setup ====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ==== PUBLIC: Get all active board members ====
router.get('/', async (req, res) => {
  try {
    const members = await BoardMember.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
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

    const imagePath = `/uploads/${req.file.filename}`;

    const member = new BoardMember({
      name,
      position,
      image: imagePath,
      order: order || 0
    });

    await member.save();
    res.status(201).json(member);
  } catch (err) {
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
    }
    res.status(500).json({ message: err.message });
  }
});

// ==== ADMIN: Update board member ====
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, position, order, isActive, imageUrl } = req.body;

    const member = await BoardMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Board member not found' });
    }

    // Store old image path in case we need to delete it
    const oldImagePath = member.image;

    member.name = name || member.name;
    member.position = position || member.position;
    member.order = order !== undefined ? order : member.order;
    member.isActive = isActive !== undefined ? isActive : member.isActive;

    if (req.file) {
      member.image = `/uploads/${req.file.filename}`;
      
      // Delete old image if it exists and is different
      if (oldImagePath && oldImagePath !== member.image) {
        const oldFilePath = path.join(__dirname, '..', oldImagePath);
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
    } else if (imageUrl) {
      member.image = imageUrl;
    }

    await member.save();
    res.json(member);
  } catch (err) {
    // If there was an error and a new file was uploaded, delete it
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
    }
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

    // Delete the image file if it exists
    if (member.image) {
      const imagePath = path.join(__dirname, '../..', member.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image file:', err);
      });
    }

    await member.deleteOne();
    res.json({ message: 'Board member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
