const express = require('express');
const Destination = require('../models/Destination');

const router = express.Router();

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const { region, heritage, search } = req.query;
    let query = {};
    if (region && region !== 'all') query.region = region;
    if (heritage && heritage !== 'all') query.heritage = heritage;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { englishName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const destinations = await Destination.find(query);
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching destinations' });
  }
});

// Create new destination
router.post('/', async (req, res) => {
  try {
    const destination = new Destination(req.body);
    await destination.save();
    res.status(201).json(destination);
  } catch (err) {
    res.status(400).json({ error: 'Error creating destination' });
  }
});

module.exports = router;