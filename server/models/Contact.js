const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address']
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  enquiryType: {
    type: String,
    enum: ['General Enquiry', 'Commercial Properties', 'Residential Properties', 'Investment Opportunities'],
    required: true
  },
  message: {
    type: String,
    required: true,   // make false if message is optional
    trim: true
  }
}, { timestamps: true });

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry;
