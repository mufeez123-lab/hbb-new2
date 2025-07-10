const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  images: [
    {
      url: {
        type: String,
        required: true
      },
      public_id: {
        type: String,
        required: true
      }
    }
  ],


  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'featured', 'ready to move', 'completed']
  },
  client: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    trim: true
  },
  explore: {
    type: Boolean,
    default: true
  },
  amenities: {
    type: [String],
    default: []
  },
  specifications: [
    {
      title: {
        type: String,
        required: true
      },
      description: {
        type: [String],
        required: true
      }
    }
  ]
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
