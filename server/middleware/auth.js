const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Ensure dotenv is configured at the very top of your application's entry file (e.g., server.js, app.js)
// If this file is being required, make sure dotenv.config() runs before process.env.JWT_SECRET is accessed.
require('dotenv').config(); 

const auth = async (req, res, next) => {
  try {
    console.log('=== Auth Middleware Start ===');
    console.log('Headers:', req.headers);
    
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No Bearer token found in header');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token ? 'Token exists' : 'No token');

    if (!token) {
      console.log('No token found after Bearer');
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      // --- IMPORTANT DEBUGGING LOGS ADDED HERE ---
      // Log the actual JWT_SECRET value, its type, and its length to verify consistency
      console.log('Auth Middleware - JWT_SECRET (for verification):', process.env.JWT_SECRET);
      console.log('Auth Middleware - JWT_SECRET type:', typeof process.env.JWT_SECRET);
      console.log('Auth Middleware - JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
      // --- END DEBUGGING LOGS ---

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded);

      const user = await User.findById(decoded.id);
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('User not found in database');
        return res.status(401).json({ message: 'User not found' });
      }

      if (!user.isActive) {
        console.log('User account is deactivated');
        return res.status(401).json({ message: 'Account is deactivated' });
      }

      req.user = user;
      console.log('=== Auth Middleware Success ===');
      next();
    } catch (jwtError) {
      console.error('JWT verification error (Auth Middleware):', jwtError);
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      // Re-throw other unexpected errors to be caught by the outer try-catch
      throw jwtError; 
    }
  } catch (err) {
    console.error('Auth middleware outer error:', err);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    console.log('=== Admin Auth Middleware Start ===');
    console.log('Headers:', req.headers);
    
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No Bearer token found in header');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token ? 'Token exists' : 'No token');

    if (!token) {
      console.log('No token found after Bearer');
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      // --- IMPORTANT DEBUGGING LOGS ADDED HERE ---
      // Log the actual JWT_SECRET value, its type, and its length to verify consistency
      console.log('Admin Auth Middleware - JWT_SECRET (for verification):', process.env.JWT_SECRET);
      console.log('Admin Auth Middleware - JWT_SECRET type:', typeof process.env.JWT_SECRET);
      console.log('Admin Auth Middleware - JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
      // --- END DEBUGGING LOGS ---

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded);

      const user = await User.findById(decoded.id);
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('User not found in database');
        return res.status(401).json({ message: 'User not found' });
      }

      if (!user.isActive) {
        console.log('User account is deactivated');
        return res.status(401).json({ message: 'Account is deactivated' });
      }

      if (user.role !== 'admin') {
        console.log('User is not an admin');
        return res.status(403).json({ message: 'Admin access required' });
      }

      req.user = user;
      console.log('=== Admin Auth Middleware Success ===');
      next();
    } catch (jwtError) {
      console.error('JWT verification error (Admin Auth Middleware):', jwtError);
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      // Re-throw other unexpected errors to be caught by the outer try-catch
      throw jwtError; 
    }
  } catch (err) {
    console.error('Admin auth middleware outer error:', err);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = { auth, adminAuth };