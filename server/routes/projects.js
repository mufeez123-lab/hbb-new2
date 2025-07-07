const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const Project = require('../models/Project');
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
  cloudinary: cloudinary,
  params: {
    folder: 'projects',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

// === GET: All Projects ===
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === GET: Featured Projects (with explore true, Limit 9) ===
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'featured', explore: true }) // ✅ Only those meant to show Explore
      .sort({ createdAt: -1 })
      .limit(9);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === GET: Single Project by ID ===
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

// === POST: Create Project ===
router.post('/', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      status,
      location,
      client,
      price,
      amenities,
      explore, // ✅ Add explore
    } = req.body;

    const images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
    }));

    let amenitiesArray = [];
    if (amenities) {
      if (Array.isArray(amenities)) {
        amenitiesArray = amenities;
      } else {
        amenitiesArray = [amenities];
      }
    }

    const project = new Project({
      name,
      description,
      category,
      status,
      location,
      client,
      price,
      amenities: amenitiesArray,
      explore: explore === 'true', // ✅ Convert to boolean
      images,
    });

    await project.save();

    req.app.get('io').emit('project:created', project);

    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// === PUT: Update Project ===
router.put('/:id', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      status,
      location,
      client,
      price,
      amenities,
      explore, // ✅ Add explore
    } = req.body;

    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    let amenitiesArray = [];
    if (amenities) {
      if (Array.isArray(amenities)) {
        amenitiesArray = amenities;
      } else {
        amenitiesArray = [amenities];
      }
    }

    const updateData = {
      name,
      description,
      category,
      status,
      location,
      client,
      price,
      amenities: amenitiesArray,
      explore: explore === 'true', // ✅ Convert to boolean
    };

    if (req.files && req.files.length > 0) {
      // Delete old Cloudinary images
      for (const img of existingProject.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      updateData.images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    req.app.get('io').emit('project:updated', updatedProject);

    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// === DELETE: Delete Project ===
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    for (const img of project.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await project.deleteOne();

    req.app.get('io').emit('project:deleted', req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
