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
  desktopImage: {
    type: imageSchema,
    required: false, // Set to false since a user may not upload one immediately
  },
  mobileImage: {
    type: imageSchema,
    required: false, // Set to false for the same reason
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const HeroSection = mongoose.model('HeroSection', heroSectionSchema);
module.exports = HeroSection;