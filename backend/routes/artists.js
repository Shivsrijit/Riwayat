const express = require('express');
const Artist = require('../models/Artist');

const router = express.Router();

// Get all artists
router.get('/', async (req, res) => {
  try {
    const { craft, region, search } = req.query;
    let query = {};
    if (craft && craft !== 'all') query.craft = craft;
    if (region && region !== 'all') query.region = region;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { craft: { $regex: search, $options: 'i' } }
      ];
    }
    const artists = await Artist.find(query).sort({ rating: -1 });
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching artists' });
  }
});

// Get single artist
router.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching artist' });
  }
});

// Add new artist profile
router.post('/', async (req, res) => {
  try {
    const artist = new Artist(req.body);
    await artist.save();
    res.status(201).json(artist);
  } catch (err) {
    res.status(400).json({ error: 'Error creating artist profile' });
  }
});

module.exports = router;
