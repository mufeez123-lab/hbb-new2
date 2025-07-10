const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const Project = require('../models/Project');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path'); // Added path module

// Load environment variables based on your project structure.
// This line assumes .env is in the project root.
// If your .env is in the same directory as this file, you might use:
// require('dotenv').config();
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Log environment variables at startup for debugging
// IMPORTANT: Never log API_SECRET in production logs! For development debugging only.
console.log('Backend Startup: CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('Backend Startup: CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Loaded' : 'Not Loaded');
console.log('Backend Startup: CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Loaded' : 'Not Loaded');
console.log('Backend Startup: JWT_SECRET_FOR_SIGNING:', process.env.JWT_SECRET ? 'Loaded' : 'Not Loaded'); // Added for JWT debugging

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
    // Optional: quality, transformation, etc.
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit (example)
  fileFilter: (req, file, cb) => {
    // Basic file type check
    if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, JPG are allowed.'), false);
    }
  },
});

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
    // Handle Mongoose CastError if ID is malformed
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid Project ID' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/* === POST: Create New Project === */
router.post('/', adminAuth, upload.array('images', 10), async (req, res) => {
    console.log('🟢 POST /api/admin/projects - Incoming Request');
    console.log('🔍 Request Body:', req.body);
    // req.files is guaranteed to be an array by multer.array, even if empty.
    console.log('🖼️ Uploaded Files (from Multer req.files):', req.files); 

    try {
        const {
            name,
            description,
            category,
            status,
            location,
            client,
            price,
            amenities, // This might be a string (if only one) or array of strings (if multiple) from FormData
            explore,   // This might be 'true' or 'false' string from FormData
            specifications, // This will be a stringified JSON array
        } = req.body;

        // --- Handle Images ---
        const images = (req.files && req.files.length > 0)
            ? req.files.map((file) => ({
                url: file.path,
                public_id: file.filename,
            }))
            : []; // Ensure it's an empty array if no files were uploaded

        // --- Handle Amenities ---
        // FormData sends array items as separate key-value pairs (e.g., amenities=A, amenities=B)
        // Express/Body-parser then typically converts it to an array.
        // But if only one amenity is sent, it might be a single string.
        const amenitiesArray = Array.isArray(amenities)
            ? amenities
            : (amenities ? [amenities] : []); // Convert single string to array, or default to empty array

        // --- Handle Specifications ---
        let specificationsArray = [];
        if (specifications) {
            try {
                // Ensure specifications is parsed correctly. Frontend sends it as JSON string.
                const parsedSpecs = typeof specifications === 'string'
                    ? JSON.parse(specifications)
                    : specifications; // If it's already an object (e.g., from other body parsers)

                // Validate and map the parsed specifications
                if (Array.isArray(parsedSpecs)) {
                    specificationsArray = parsedSpecs.map((spec) => ({
                        title: spec.title || '', // Ensure title exists
                        description: Array.isArray(spec.description)
                            ? spec.description.filter(Boolean) // Filter out empty strings
                            : (spec.description ? [spec.description] : []), // Convert single string to array
                    }));
                } else {
                    // If specifications is not an array after parsing, it's invalid.
                    console.error('❌ Specifications not an array after parsing:', parsedSpecs);
                    return res.status(400).json({ message: 'Specifications must be an array of objects.' });
                }
            } catch (specErr) {
                console.error('❌ Invalid specifications JSON format during POST:', specifications, 'Error:', specErr);
                return res.status(400).json({ message: 'Invalid specifications JSON format. Please check the structure.' });
            }
        }
        
        // --- Prepare Project Data ---
        const newProjectData = {
            name,
            description,
            category,
            status,
            location,
            client,
            price: price || undefined, // Set to undefined if empty string, so Mongoose doesn't save empty string for optional fields
            amenities: amenitiesArray,
            // Convert 'explore' string to boolean if it came as a string
            explore: typeof explore === 'string' ? explore === 'true' : Boolean(explore),
            images, // Array of { url, public_id }
            specifications: specificationsArray,
        };

        console.log('Backend: Data prepared for new Project:', newProjectData);

        const project = new Project(newProjectData);
        await project.save(); // This is where Mongoose validation errors will occur

        console.log('Backend: Project saved to DB successfully:', project._id);

        const io = req.app.get('io');
        if (io) {
            io.emit('project:created', project);
            console.log('Backend: Socket.io emitted project:created event.');
        } else {
            console.warn('⚠️ Socket.io not initialized or unavailable in req.app.');
        }

        res.status(201).json(project);
    } catch (err) {
        console.error('❌ POST /projects Error:', err); // More prominent error log
        // Distinguish Mongoose validation errors from generic server errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: 'Validation Error', errors: messages });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

/* === PUT: Update Project === */
router.put('/:id', adminAuth, upload.array('images', 10), async (req, res) => {
    console.log(`🟢 PUT /api/admin/projects/${req.params.id} - Incoming Request`);
    console.log('🔍 Request Body:', req.body);
    console.log('🖼️ Uploaded Files (from Multer req.files):', req.files); // CRUCIAL for debugging PUT

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
        if (!existingProject) {
            console.warn(`Backend: Project with ID ${req.params.id} not found for update.`);
            return res.status(404).json({ message: 'Project not found' });
        }

        // --- Handle Amenities ---
        const amenitiesArray = Array.isArray(amenities)
            ? amenities
            : (amenities ? [amenities] : []);

        // --- Handle Specifications ---
        let specificationsArray = [];
        if (specifications) {
            try {
                const parsedSpecs = typeof specifications === 'string'
                    ? JSON.parse(specifications)
                    : specifications;

                if (Array.isArray(parsedSpecs)) {
                    specificationsArray = parsedSpecs.map((spec) => ({
                        title: spec.title || '',
                        description: Array.isArray(spec.description)
                            ? spec.description.filter(Boolean)
                            : (spec.description ? [spec.description] : []),
                    }));
                } else {
                    console.error('❌ Specifications not an array after parsing for update:', parsedSpecs);
                    return res.status(400).json({ message: 'Specifications must be an array of objects.' });
                }
            } catch (specErr) {
                console.error('❌ Invalid specifications JSON format during update:', specifications, 'Error:', specErr);
                return res.status(400).json({ message: 'Invalid specifications JSON format. Please check the structure.' });
            }
        }
        
        // --- Prepare Update Data ---
        const updateData = {
            name,
            description,
            category,
            status,
            location,
            client,
            price: price || undefined,
            amenities: amenitiesArray,
            explore: typeof explore === 'string' ? explore === 'true' : Boolean(explore),
            specifications: specificationsArray,
        };

        // --- Handle Images for Update ---
        if (req.files && req.files.length > 0) {
            // New files are uploaded, so delete old ones from Cloudinary first
            console.log('Backend: New files detected for update. Deleting old images from Cloudinary.');
            for (const img of existingProject.images) {
                if (img.public_id) {
                    try {
                        await cloudinary.uploader.destroy(img.public_id);
                        console.log(`Backend: Deleted Cloudinary image: ${img.public_id}`);
                    } catch (cloudinaryErr) {
                        console.error(`Backend: Error deleting Cloudinary image ${img.public_id}:`, cloudinaryErr);
                        // Log the error but don't prevent the update if old image deletion fails
                    }
                }
            }
            // Assign the new images
            updateData.images = req.files.map((file) => ({
                url: file.path,
                public_id: file.filename,
            }));
            console.log('Backend: Assigned new images to update data:', updateData.images);
        } else {
            // If NO new files are uploaded, retain the existing images from the database
            console.log('Backend: No new files uploaded. Retaining existing images.');
            updateData.images = existingProject.images;
        }
        
        console.log('Backend: Data prepared for Project Update:', updateData);

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true } // `new: true` returns the updated document; `runValidators: true` applies schema validation
        );

        if (!updatedProject) {
            console.warn(`Backend: Project with ID ${req.params.id} not found during update after initial check (race condition?).`);
            return res.status(404).json({ message: 'Project not found or could not be updated.' });
        }

        console.log('Backend: Project updated in DB successfully:', updatedProject._id);

        const io = req.app.get('io');
        if (io) {
            io.emit('project:updated', updatedProject);
            console.log('Backend: Socket.io emitted project:updated event.');
        } else {
            console.warn('⚠️ Socket.io not initialized or unavailable in req.app.');
        }

        res.json(updatedProject);
    } catch (err) {
        console.error('❌ PUT /projects Error:', err); // More prominent error log
        // Distinguish Mongoose validation errors from generic server errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: 'Validation Error', errors: messages });
        }
        // Handle Mongoose CastError if ID is malformed
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Project ID for update' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

/* === DELETE: Project === */
router.delete('/:id', adminAuth, async (req, res) => {
  console.log(`🟢 DELETE /api/admin/projects/${req.params.id} - Incoming Request`);
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
        console.warn(`Backend: Project with ID ${req.params.id} not found for deletion.`);
        return res.status(404).json({ message: 'Project not found' });
    }

    console.log(`Backend: Deleting Cloudinary images for project ${req.params.id}.`);
    // Use Promise.allSettled to ensure all deletions are attempted and log results
    await Promise.allSettled(
        project.images.map(async (img) => {
            if (img.public_id) {
                try {
                    await cloudinary.uploader.destroy(img.public_id);
                    console.log(`Backend: Successfully deleted Cloudinary image: ${img.public_id}`);
                    return { status: 'fulfilled', public_id: img.public_id };
                } catch (cloudinaryErr) {
                    console.error(`Backend: Error deleting Cloudinary image ${img.public_id}:`, cloudinaryErr);
                    return { status: 'rejected', public_id: img.public_id, error: cloudinaryErr };
                }
            }
            return { status: 'skipped', message: 'No public_id for image' };
        })
    );

    await project.deleteOne();
    console.log(`Backend: Project ${req.params.id} deleted from DB.`);

    const io = req.app.get('io');
    if (io) {
      io.emit('project:deleted', req.params.id);
      console.log('Backend: Socket.io emitted project:deleted event.');
    } else {
        console.warn('⚠️ Socket.io not initialized or unavailable in req.app.');
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('❌ DELETE /projects Error:', err); // Specific log
    // Handle Mongoose CastError if ID is malformed
    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid Project ID for deletion' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;