const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/admin/register
 * @desc    Register new admin (no auth required)
 */
router.post('/register', async (req, res) => {
  try {
    console.log('=== Admin Registration Start ===');
    const { name, email, password } = req.body;
    console.log('Registration attempt for:', { name, email });

    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format');
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role: 'admin',
      isActive: true
    });

    await user.save();
    console.log('Admin registered successfully:', { id: user._id, email: user.email });

    res.status(201).json({
      message: 'Admin registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

/**
 * @route   POST /api/admin/login
 * @desc    Login as admin (no auth required)
 */
router.post('/login', async (req, res) => {
  try {
    console.log('=== Admin Login Start ===');
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      console.log('Account deactivated');
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // 4. Prepare the payload for the JWT
    const payload = {
      id: user._id,
      role: user.role // Include user's role if your adminAuth middleware checks it
    };

    // Capture the secret variable from environment variables
    const secretUsedForSigning = process.env.JWT_SECRET;

    // --- IMPORTANT DEBUGGING LOGS ---
    // These logs will show you the exact secret value, its type, and length
    // right before the token is signed.
    console.log('--- TOKEN SIGNING DEBUG ---');
    console.log('Secret used for SIGNING:', secretUsedForSigning);
    console.log('Type of secret used for SIGNING:', typeof secretUsedForSigning);
    console.log('Length of secret used for SIGNING:', secretUsedForSigning ? secretUsedForSigning.length : 0);
    console.log('--- END TOKEN SIGNING DEBUG ---');

    // 5. Sign the token using the payload and the secret
    // The token will expire in 1 hour (you can adjust this as needed)
    let token = jwt.sign(payload, secretUsedForSigning, { expiresIn: '1h' });

    // Check for existing token in request headers
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const existingToken = authHeader.split(' ')[1];
      try {
        // Verify if existing token is valid
        const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);
        if (decoded.id === user._id.toString()) {
          console.log('Reusing existing valid token');
          token = existingToken;
        }
      } catch (err) {
        console.log('Existing token invalid or expired, generating new token');
      }
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log('=== Admin Login Success ===');
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error details:', err);
    res.status(500).json({
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/**
 * @route   GET /api/admin/me
 * @desc    Get current logged-in admin (auth required)
 */
router.get('/me', adminAuth, async (req, res) => {
  try {
    console.log('=== Get Admin Profile Start ===');
    console.log('User ID from request:', req.user.id);
    
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('=== Get Admin Profile Success ===');
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   PUT /api/admin/change-password
 * @desc    Change admin password (auth required)
 */
router.put('/change-password', adminAuth, async (req, res) => {
  try {
    console.log('=== Change Password Start ===');
    const { currentPassword, newPassword } = req.body;
    console.log('Password change attempt for user:', req.user.id);

    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      console.log('Current password incorrect');
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    console.log('Password updated successfully');

    console.log('=== Change Password Success ===');
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
