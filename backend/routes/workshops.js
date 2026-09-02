const express = require('express');
const Workshop = require('../models/Workshop');

const router = express.Router();

// Get all workshops
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let query = {};
    if (category && category !== 'all') query.category = category;
    if (difficulty && difficulty !== 'all') query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } }
      ];
    }
    const workshops = await Workshop.find(query).sort({ rating: -1 });
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching workshops' });
  }
});

// Get workshop by ID
router.get('/:id', async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ error: 'Workshop not found' });
    res.json(workshop);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching workshop details' });
  }
});

// Create new workshop
router.post('/', async (req, res) => {
  try {
    const workshop = new Workshop(req.body);
    await workshop.save();
    res.status(201).json(workshop);
  } catch (err) {
    res.status(400).json({ error: 'Error creating workshop' });
  }
});

// Enroll in workshop
router.post('/:id/enroll', async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(
      req.params.id,
      { $inc: { enrolledCount: 1 } },
      { new: true }
    );
    res.json({ message: 'Successfully enrolled!', workshop });
  } catch (err) {
    res.status(500).json({ error: 'Error enrolling in workshop' });
  }
});

module.exports = router;
