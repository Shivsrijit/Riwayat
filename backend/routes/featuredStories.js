const express = require('express');
const FeaturedStory = require('../models/FeaturedStory');

const router = express.Router();

// Get all featured stories (with filtering)
router.get('/', async (req, res) => {
  try {
    const { category, region, search } = req.query;
    let query = { isApproved: true };

    if (category && category !== 'all') {
      query.category = category;
    }
    if (region && region !== 'all') {
      query.region = region;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const stories = await FeaturedStory.find(query).sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching stories' });
  }
});

// Get story by ID
router.get('/:id', async (req, res) => {
  try {
    const story = await FeaturedStory.findById(req.params.id);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching story' });
  }
});

// Create new story (Creator Hub submission)
router.post('/', async (req, res) => {
  try {
    const story = new FeaturedStory(req.body);
    await story.save();
    res.status(201).json(story);
  } catch (err) {
    res.status(400).json({ error: 'Error creating story submission' });
  }
});

// Upvote story
router.post('/:id/upvote', async (req, res) => {
  try {
    const story = await FeaturedStory.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: 'Error upvoting story' });
  }
});

module.exports = router;