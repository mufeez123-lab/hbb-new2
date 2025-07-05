const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');


const uploadsDir = path.join(__dirname, '../uploads');
// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,uploadsDir );
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get featured projects (limit to 6)
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new project
router.post('/', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, category,status, location, client, price } = req.body;
    const images = req.files.map(file => `/uploads/${file.filename}`);

    const project = new Project({
      name,
      description,
      category,
      status,
      location,
      client,
      price,
      images
    });

    await project.save();

    // Emit real-time update
    req.app.get('io').emit('project:created', project);

    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update project
router.put('/:id', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, category,status, location, client, price } = req.body;
    const updateData = {
      name,
      description,
      category,
      status,
      location,
      client,
      price,

    };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Emit real-time update
    req.app.get('io').emit('project:updated', project);

    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete project
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Emit real-time update
    req.app.get('io').emit('project:deleted', req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 