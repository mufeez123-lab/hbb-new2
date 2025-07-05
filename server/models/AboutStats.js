const mongoose = require('mongoose');

const aboutStatsSchema = new mongoose.Schema({
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0
  },
  completedProjects: {
    type: Number,
    required: true,
    min: 0
  },
  happyClients: {
    type: Number,
    required: true,
    min: 0
  },
  awardsWon:{
    type:Number,
    required:true,
    min:0

  }
}, {
  timestamps: true
});

const AboutStats = mongoose.model('AboutStats', aboutStatsSchema);

module.exports = AboutStats; 