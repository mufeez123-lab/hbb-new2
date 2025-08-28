require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import User model
const User = require('../models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://mufeez:786313Mufeez@cluster0.lvkokln.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'adminhindustan@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('newAdmin123', 10);

    // Create admin user
    const adminUser = new User({
      name: 'Admin',
      email: 'adminhindustan@gmail.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: adminhindustan@gmail.com');
    console.log('Password: newAdmin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin(); 