const mongoose = require('mongoose');

const brochureSchema = new mongoose.Schema({
  pdfUrl: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Brochure', brochureSchema);
