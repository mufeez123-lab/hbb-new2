const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const AboutStats = require('../models/AboutStats');

// Get about stats
router.get('/', async (req, res) => {
  try {
    const stats = await AboutStats.findOne();
    res.json(stats || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create about stats (POST)
router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      yearsOfExperience,
      completedProjects,
      happyClients,
      awardsWon
    } = req.body;

    // Check if a stats document already exists
    const existing = await AboutStats.findOne();
    if (existing) {
      return res.status(400).json({ message: 'Stats already exist. Use PUT to update.' });
    }

    const stats = new AboutStats({
      yearsOfExperience,
      completedProjects,
      happyClients,
      awardsWon
    });

    await stats.save();

    res.status(201).json(stats);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update about stats
router.put('/', adminAuth, async (req, res) => {
  try {
    const {
      yearsOfExperience,
      completedProjects,
      happyClients,
      awardsWon
    } = req.body;

    const stats = await AboutStats.findOneAndUpdate(
      {},
      {
        yearsOfExperience,
        completedProjects,
        happyClients,
        awardsWon
      },
      { new: true, upsert: true }
    );

    // Emit real-time update
    req.app.get('io').emit('about:updated', stats);

    res.json(stats);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 