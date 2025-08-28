// routes/adminTestimonials.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Mongoose schema
const testimonialSchema = new mongoose.Schema({
  name: String,
  title: String,
  quote: String
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

// GET all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// POST new testimonial
router.post('/', async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create testimonial' });
  }
});

// PUT update testimonial
router.put('/:id', async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update testimonial' });
  }
});

// DELETE testimonial
router.delete('/:id', async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete testimonial' });
  }
});

module.exports = router;
