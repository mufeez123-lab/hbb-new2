const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Updated Schema
const brochureSchema = new mongoose.Schema({
  pdfUrl: String,
  public_id: String,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  uploadedAt: { type: Date, default: Date.now },
});
const Brochure = mongoose.model('Brochure', brochureSchema);

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'brochures',
    resource_type: 'raw',
    format: async () => 'pdf',
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
  },
});
const upload = multer({ storage });

// Upload route
router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF uploaded' });

    const { path: pdfUrl, filename: public_id } = req.file;
    const { projectId } = req.body;

    if (!projectId) return res.status(400).json({ error: 'Project ID is required' });

    const brochure = new Brochure({ pdfUrl, public_id, projectId });
    await brochure.save();

    res.status(201).json({ message: 'PDF uploaded', brochure });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all brochures
router.get('/', async (req, res) => {
  try {
    const brochures = await Brochure.find().sort({ uploadedAt: -1 });
    res.json(brochures);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch brochures' });
  }
});

// Get brochures by project
router.get('/by-project/:projectId', async (req, res) => {
  try {
    const brochure = await Brochure.find({ projectId: req.params.projectId }).sort({ uploadedAt: -1 });
    res.json(brochure);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch brochure for project' });
  }
});

// Delete brochure
router.delete('/:id', async (req, res) => {
  try {
    const brochure = await Brochure.findById(req.params.id);
    if (!brochure) return res.status(404).json({ error: 'Brochure not found' });

    await cloudinary.uploader.destroy(brochure.public_id, { resource_type: 'raw' });
    await Brochure.findByIdAndDelete(req.params.id);

    res.json({ message: 'PDF deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete brochure' });
  }
});

module.exports = router;
