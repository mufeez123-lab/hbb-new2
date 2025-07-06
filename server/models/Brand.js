// models/Brand.js
const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
