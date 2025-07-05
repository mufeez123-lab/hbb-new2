require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const jwt = require('jsonwebtoken');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const brandRoutes = require('./routes/brands');
const aboutRoutes = require('./routes/about');
const heroRoutes = require('./routes/hero');
const boardRoutes = require('./routes/board');
const adminTestimonialsRoutes = require('./routes/adminTestimonials');

const app = express();
const server = http.createServer(app);

// ✅ Define allowed origins for both local and production
const allowedOrigins = [
  
  'https://hbb-new2-fhnh.vercel.app'
];

// ✅ CORS for Express API
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin: ' + origin));
    }
  },
  credentials: true
}));
app.options('*', cors()); // for handling preflight

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files (e.g., uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log static file requests for debugging
app.use('/uploads', (req, res, next) => {
  console.log('Static file request:', req.url);
  next();
});

// ✅ Socket.IO setup with proper CORS
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ✅ Socket.IO auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// ✅ Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io instance available to routes
app.set('io', io);

// ✅ API Routes
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/projects', projectRoutes);
app.use('/api/admin/brands', brandRoutes);
app.use('/api/admin/about', aboutRoutes);
app.use('/api/admin/hero', heroRoutes);
app.use('/api/admin/board', boardRoutes);
app.use('/admin/testimonials', adminTestimonialsRoutes);

// ✅ Public API routes
app.use('/api/board', boardRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/projects', projectRoutes);

// Root check route
app.get('/', (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
  });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hindustan', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
