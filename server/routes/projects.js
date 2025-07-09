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
  cloudinary,
  params: { folder: 'projects', allowed_formats: ['jpg','jpeg','png'] },
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  return res.json(projects);
});

router.get('/featured', async (req, res) => {
  const projects = await Project.find({ status: 'featured', explore: true })
    .sort({ createdAt: -1 }).limit(9);
  return res.json(projects);
});

router.get('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  return res.json(project);
});

router.post(
  '/',
  adminAuth,
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'plans', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      console.log('POST body:', req.body);
      console.log('Files:', req.files);

      const {
        name, description, category, status,
        location, client, price, amenities,
        explore, specifications
      } = req.body;

      if (!name || !description || !client) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const images = Array.isArray(req.files?.images)
        ? req.files.images.map(f => ({ url: f.path, public_id: f.filename }))
        : [];
      const plans = Array.isArray(req.files?.plans)
        ? req.files.plans.map(f => ({ url: f.path, public_id: f.filename }))
        : [];

      const amenitiesArr = Array.isArray(amenities)
        ? amenities
        : amenities ? [amenities] : [];

      let specsArr = [];
      if (specifications) {
        try {
          const parsed = typeof specifications === 'string'
            ? JSON.parse(specifications) : specifications;
          specsArr = parsed.map(s => ({
            title: s.title,
            description: Array.isArray(s.description) ? s.description : [s.description]
          }));
        } catch (err) {
          console.error('Specs parse failed', err);
          return res.status(400).json({ message: 'Invalid specifications JSON' });
        }
      }

      const project = new Project({
        name, description, category, status,
        location, client, price,
        explore: explore === 'true',
        images, plans: plans || [],
        amenities: amenitiesArr,
        specifications: specsArr
      });

      await project.save();
      return res.status(201).json(project);

    } catch (err) {
      console.error('POST error:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

router.put(
  '/:id',
  adminAuth,
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'plans', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      console.log('PUT body:', req.body);
      console.log('PUT files:', req.files);

      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ message: 'Not found' });

      const {
        name, description, category, status,
        location, client, price, amenities,
        explore, specifications
      } = req.body;

      const imagesArr = Array.isArray(req.files?.images)
        ? req.files.images.map(f => ({ url: f.path, public_id: f.filename }))
        : undefined;
      const plansArr = Array.isArray(req.files?.plans)
        ? req.files.plans.map(f => ({ url: f.path, public_id: f.filename }))
        : undefined;

      const amenitiesArr = Array.isArray(amenities)
        ? amenities
        : amenities ? [amenities] : [];

      let specsArr;
      if (specifications) {
        try {
          const parsed = typeof specifications === 'string'
            ? JSON.parse(specifications) : specifications;
          specsArr = parsed.map(s => ({
            title: s.title,
            description: Array.isArray(s.description) ? s.description : [s.description]
          }));
        } catch (err) {
          console.error('Specs parse failed', err);
          return res.status(400).json({ message: 'Invalid specifications JSON' });
        }
      }

      const update = {
        name, description, category, status,
        location, client, price,
        explore: explore === 'true',
        amenities: amenitiesArr,
        ...(specsArr !== undefined && { specifications: specsArr }),
      };

      // Replace image set if new ones are uploaded
      if (imagesArr) {
        project.images.forEach(img => {
          if (img.public_id) cloudinary.uploader.destroy(img.public_id);
        });
        update.images = imagesArr;
      }

      if (plansArr) {
        (project.plans || []).forEach(p => {
          if (p.public_id) cloudinary.uploader.destroy(p.public_id);
        });
        update.plans = plansArr;
      }

      const updated = await Project.findByIdAndUpdate(req.params.id, update, { new: true });
      return res.json(updated);

    } catch (err) {
      console.error('PUT error:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });

    project.images.forEach(img => img.public_id && cloudinary.uploader.destroy(img.public_id));
    (project.plans || []).forEach(p => p.public_id && cloudinary.uploader.destroy(p.public_id));
    await project.deleteOne();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DELETE error:', err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
