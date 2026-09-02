const express = require('express');
const RecentEvent = require('../models/RecentEvent');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const { region, category, search } = req.query;
    let query = {};
    if (region && region !== 'all') query.region = region;
    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    const events = await RecentEvent.find(query).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching events' });
  }
});

// Create new event
router.post('/', async (req, res) => {
  try {
    const event = new RecentEvent(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: 'Error creating event' });
  }
});

module.exports = router;