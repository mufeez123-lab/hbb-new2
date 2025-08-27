const mongoose = require('mongoose');

const heroSectionSchema = new mongoose.Schema({
  desktopImages: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    }
  ],
  mobileImages: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    }
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const HeroSection = mongoose.model('HeroSection', heroSectionSchema);
module.exports = HeroSection;
