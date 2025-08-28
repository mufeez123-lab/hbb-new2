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
   projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
   
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Brochure', brochureSchema);
