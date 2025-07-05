const mongoose = require('mongoose');

const heroSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  backgroundImage: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    required: true
  },
  buttonLink: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const HeroSection = mongoose.model('HeroSection', heroSectionSchema);

module.exports = HeroSection; 