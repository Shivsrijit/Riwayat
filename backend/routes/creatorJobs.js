const express = require('express');
const CreatorJob = require('../models/CreatorJob');

const router = express.Router();

// Get all creator job listings & grants
router.get('/', async (req, res) => {
  try {
    const jobs = await CreatorJob.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching creator job listings' });
  }
});

// Create a creator job opportunity
router.post('/', async (req, res) => {
  try {
    const job = new CreatorJob(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: 'Error creating job listing' });
  }
});

module.exports = router;
