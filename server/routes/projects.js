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
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'projects',
    allowed_formats: ['jpg','png','jpeg'],
  },
});

const upload = multer({ storage });

/* GET: All Projects */
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET: Single Project by ID */
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* POST: Create New Project */
router.post('/', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    console.log('🟢 POST /projects', { body: req.body, files: req.files });
    const {
      name, description, category, status,
      location, client, price, amenities,
      explore, specifications
    } = req.body;

    const images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
    }));

    // parse arrays safely
    const amenitiesArray = Array.isArray(amenities)
      ? amenities
      : amenities ? [amenities] : [];

    let specsArray = [];
    if (specifications) {
      try {
        const parsed = typeof specifications === 'string'
          ? JSON.parse(specifications)
          : specifications;
        specsArray = parsed.map(spec => ({
          title: spec.title,
          description: Array.isArray(spec.description)
            ? spec.description
            : [spec.description],
        }));
      } catch {
        return res.status(400).json({ message: 'Invalid specifications format' });
      }
    }

    const project = new Project({
      name, description, category, status,
      location, client, price,
      amenities: amenitiesArray,
      explore: explore === 'true',
      images,
      specifications: specsArray,
    });

    await project.save();
    req.app.get('io')?.emit('project:created', project);
    res.status(201).json(project);

  } catch (err) {
    console.error('POST /projects error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/* PUT: Update Project (append new images instead of replacing) */
router.put('/:id', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    const {
      name, description, category, status,
      location, client, price, amenities,
      explore, specifications
    } = req.body;

    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // parse arrays safely
    const amenitiesArray = Array.isArray(amenities)
      ? amenities
      : amenities ? [amenities] : [];

    let specsArray = [];
    if (specifications) {
      try {
        const parsed = typeof specifications === 'string'
          ? JSON.parse(specifications)
          : specifications;
        specsArray = parsed.map(spec => ({
          title: spec.title,
          description: Array.isArray(spec.description)
            ? spec.description
            : [spec.description],
        }));
      } catch {
        return res.status(400).json({ message: 'Invalid specifications format' });
      }
    }

    // Base update data
    const updateData = {
      name,
      description,
      category,
      status,
      location,
      client,
      price,
      amenities: amenitiesArray,
      explore: explore === 'true',
      specifications: specsArray,
    };

    // If new images uploaded, append them to old array
    if (req.files && req.files.length > 0) {
      // keep existing images
      const oldImages = existingProject.images;

      // build new images
      const newImages = req.files.map(file => ({
        url: file.path,
        public_id: file.filename,
      }));

      updateData.images = oldImages.concat(newImages);
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    req.app.get('io')?.emit('project:updated', updated);
    res.json(updated);

  } catch (err) {
    console.error('PUT /projects error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/* DELETE: Project */
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // remove images from Cloudinary
    for (const img of project.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await project.deleteOne();
    req.app.get('io')?.emit('project:deleted', req.params.id);
    res.json({ message: 'Project deleted successfully' });

  } catch (err) {
    console.error('DELETE /projects error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
