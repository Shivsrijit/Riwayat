const express = require('express');
const FeaturedStory = require('../models/FeaturedStory');
const Destination = require('../models/Destination');

const router = express.Router();

// Region Lat/Lng Coordinate Lookup Table for Indian States
const STATE_COORDINATES = {
  'Rajasthan': { lat: 26.9124, lng: 75.7873 },
  'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
  'Kerala': { lat: 10.8505, lng: 76.2711 },
  'Tamil Nadu': { lat: 11.1271, lng: 78.6569 },
  'Maharashtra': { lat: 19.7515, lng: 75.7139 },
  'Madhya Pradesh': { lat: 23.2599, lng: 77.4126 },
  'Karnataka': { lat: 15.3173, lng: 75.7139 },
  'Gujarat': { lat: 22.2587, lng: 71.1924 },
  'West Bengal': { lat: 22.9868, lng: 87.8550 },
  'Odisha': { lat: 20.9517, lng: 85.0985 },
  'Punjab': { lat: 31.1471, lng: 75.3412 },
  'Himachal Pradesh': { lat: 31.1048, lng: 77.1734 },
  'Assam': { lat: 26.2006, lng: 92.9376 },
  'Bihar': { lat: 25.0961, lng: 85.3131 },
  'Jammu & Kashmir': { lat: 33.7782, lng: 76.5762 }
};

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

// Create new story (Creator Hub submission & auto-map pin creation)
router.post('/', async (req, res) => {
  try {
    const storyData = {
      isApproved: true,
      ...req.body
    };
    const story = new FeaturedStory(storyData);
    await story.save();
    console.log('[DB SUCCESS] Saved new story to MongoDB:', story.title);

    // Auto-create map destination pin if region is specified
    if (story.region) {
      try {
        const coords = STATE_COORDINATES[story.region] || { lat: 20.5937, lng: 78.9629 };
        const randomOffsetLat = (Math.random() - 0.5) * 0.4;
        const randomOffsetLng = (Math.random() - 0.5) * 0.4;

        const newDestination = new Destination({
          name: story.title,
          englishName: story.title,
          description: story.description,
          image: story.image,
          region: story.region,
          lat: coords.lat + randomOffsetLat,
          lng: coords.lng + randomOffsetLng,
          heritage: 'Community Cultural Archive',
          bestTime: 'All Year',
          entryFee: 'Free',
          highlights: [story.category, story.region]
        });
        await newDestination.save();
        console.log('[MAP AUTO-PIN] Created new Leaflet map destination pin for:', story.title);
      } catch (mapErr) {
        console.warn('Map destination auto-pin notice:', mapErr.message);
      }
    }

    res.status(201).json(story);
  } catch (err) {
    console.error('[STORY POST ERROR]', err);
    res.status(400).json({ error: 'Error creating story submission: ' + err.message });
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