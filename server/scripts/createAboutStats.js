require('dotenv').config();
const mongoose = require('mongoose');
const AboutStats = require('../models/AboutStats');

const initialStats = {
  yearsOfExperience: 25,
  completedProjects: 150,
  happyClients: 500,
  awardsWon: 15
};

async function createAboutStats() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hindustan', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if stats already exist
    const existingStats = await AboutStats.findOne();
    if (existingStats) {
      console.log('About stats already exist:', existingStats);
      return;
    }

    // Create new stats
    const stats = new AboutStats(initialStats);
    await stats.save();
    
    console.log('About stats created successfully:', stats);
  } catch (error) {
    console.error('Error creating about stats:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAboutStats(); 