const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
});

const heroSectionSchema = new mongoose.Schema({
  desktopImages: [imageSchema],
  mobileImages: [imageSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const HeroSection = mongoose.model('HeroSection', heroSectionSchema);
module.exports = HeroSection;