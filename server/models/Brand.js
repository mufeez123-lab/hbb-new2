const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  image: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Brand', brandSchema);
