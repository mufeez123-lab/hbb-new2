const mongoose = require('mongoose');

const boardMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  bio:String,
}, {
  timestamps: true
});

const BoardMember = mongoose.model('BoardMember', boardMemberSchema);

module.exports = BoardMember;
