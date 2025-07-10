const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const Project = require('../models/Project');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Log environment variables at startup for debugging
console.log('Backend Startup: CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('Backend Startup: CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Loaded' : 'Not Loaded');
console.log('Backend Startup: CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Loaded' : 'Not Loaded');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'projects',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

/* === GET: All Projects === */
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('❌ GET /projects Error:', err); // Specific log
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/* === GET: Featured Projects === */
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'featured', explore: true })
      .sort({ createdAt: -1 })
      .limit(9);
    res.json(projects);
  } catch (err) {
    console.error('❌ GET /projects/featured Error:', err); // Specific log
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/* === GET: Single Project by ID === */
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error(`❌ GET /projects/${req.params.id} Error:`, err); // Specific log
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/* === POST: Create New Project === */
router.post('/', adminAuth, upload.array('images', 10), async (req, res) => {
    console.log('🟢 POST /api/admin/projects');
    console.log('🔍 Request Body:', req.body);
    console.log('🖼️ Uploaded Files (from Multer):', req.files); // CRUCIAL for debugging POST

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
            explore,
            specifications,
        } = req.body;

        // Ensure images array is always present, even if empty
        const images = (req.files && req.files.length > 0)
            ? req.files.map((file) => ({
                url: file.path,
                public_id: file.filename,
            }))
            : []; // Initialize as empty array if no files

        const amenitiesArray = Array.isArray(amenities)
            ? amenities
            : (amenities ? [amenities] : []); // Handles single amenity or no amenities

        let specificationsArray = [];
        try {
            if (specifications) {
                const parsedSpecs = typeof specifications === 'string'
                    ? JSON.parse(specifications)
                    : specifications;

                // Ensure description is always an array
                specificationsArray = parsedSpecs.map((spec) => ({
                    title: spec.title,
                    description: Array.isArray(spec.description)
                        ? spec.description
                        : (spec.description ? [spec.description] : []),
                }));
            }
        } catch (specErr) {
            console.error('❌ Invalid specifications format during POST:', specifications, 'Error:', specErr);
            return res.status(400).json({ message: 'Invalid specifications format' });
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
            explore: explore === 'true' || explore === true, // Handle both string 'true' and actual boolean true
            images,
            specifications: specificationsArray,
        });

        await project.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('project:created', project);
        } else {
            console.warn('⚠️ Socket.io not initialized.');
        }

        res.status(201).json(project);
    } catch (err) {
        console.error('❌ POST /projects Error:', err); // More prominent error log
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

/* === PUT: Update Project === */
router.put('/:id', adminAuth, upload.array('images', 10), async (req, res) => {
    console.log(`🟢 PUT /api/admin/projects/${req.params.id}`);
    console.log('🔍 Request Body:', req.body);
    console.log('🖼️ Uploaded Files (from Multer):', req.files); // CRUCIAL for debugging PUT

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
            explore,
            specifications,
        } = req.body;

        const existingProject = await Project.findById(req.params.id);
        if (!existingProject) return res.status(404).json({ message: 'Project not found' });

        const amenitiesArray = Array.isArray(amenities)
            ? amenities
            : (amenities ? [amenities] : []);

        let specificationsArray = [];
        try {
            if (specifications) {
                const parsedSpecs = typeof specifications === 'string'
                    ? JSON.parse(specifications)
                    : specifications;

                specificationsArray = parsedSpecs.map((spec) => ({
                    title: spec.title,
                    description: Array.isArray(spec.description)
                        ? spec.description
                        : (spec.description ? [spec.description] : []),
                }));
            }
        } catch (specErr) {
            console.error('❌ Invalid specifications format during update:', specifications, 'Error:', specErr);
            return res.status(400).json({ message: 'Invalid specifications format' });
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
            explore: explore === 'true' || explore === true, // Handle both string 'true' and actual boolean true
            specifications: specificationsArray,
        };

        // THIS IS THE CRITICAL LOGIC FOR IMAGE UPDATES
        if (req.files && req.files.length > 0) {
            // If new files are uploaded, delete old ones from Cloudinary
            console.log('Backend: New files detected. Deleting old images from Cloudinary.');
            for (const img of existingProject.images) {
                if (img.public_id) {
                    try {
                        await cloudinary.uploader.destroy(img.public_id);
                        console.log(`Backend: Deleted Cloudinary image: ${img.public_id}`);
                    } catch (cloudinaryErr) {
                        console.error(`Backend: Error deleting Cloudinary image ${img.public_id}:`, cloudinaryErr);
                        // Decide if this should stop the process or just log and continue
                        // For now, it logs and continues, but a critical error might need a throw
                    }
                }
            }
            // Assign new images
            updateData.images = req.files.map((file) => ({
                url: file.path,
                public_id: file.filename,
            }));
            console.log('Backend: Assigned new images:', updateData.images);
        } else {
            // If NO new files are uploaded, retain the existing images from the database
            console.log('Backend: No new files uploaded. Retaining existing images.');
            updateData.images = existingProject.images;
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true } // `new: true` returns the updated document; `runValidators: true` applies schema validation
        );

        if (!updatedProject) {
            console.warn(`Backend: Project with ID ${req.params.id} not found during update after initial check.`);
            return res.status(404).json({ message: 'Project not found after update attempt.' });
        }

        const io = req.app.get('io');
        if (io) {
            io.emit('project:updated', updatedProject);
        }

        res.json(updatedProject);
    } catch (err) {
        console.error('❌ PUT /projects Error:', err); // More prominent error log
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

/* === DELETE: Project === */
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    console.log(`🟢 DELETE /api/admin/projects/${req.params.id}: Deleting Cloudinary images.`);
    for (const img of project.images) {
      if (img.public_id) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
          console.log(`Backend: Deleted Cloudinary image: ${img.public_id}`);
        } catch (cloudinaryErr) {
          console.error(`Backend: Error deleting Cloudinary image ${img.public_id}:`, cloudinaryErr);
          // Don't stop deletion of project just because an image delete failed
        }
      }
    }

    await project.deleteOne();
    console.log(`Backend: Project ${req.params.id} deleted from DB.`);


    const io = req.app.get('io');
    if (io) {
      io.emit('project:deleted', req.params.id);
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('❌ DELETE /projects Error:', err); // Specific log
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;