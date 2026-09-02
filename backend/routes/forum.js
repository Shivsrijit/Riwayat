const express = require('express');
const ForumPost = require('../models/ForumPost');

const router = express.Router();

// Get all forum posts
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    const posts = await ForumPost.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching forum posts' });
  }
});

// Create new forum post
router.post('/', async (req, res) => {
  try {
    const post = new ForumPost(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: 'Error creating forum post' });
  }
});

// Upvote post
router.post('/:id/upvote', async (req, res) => {
  try {
    const post = await ForumPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Error upvoting forum post' });
  }
});

// Add comment to post
router.post('/:id/comment', async (req, res) => {
  try {
    const { author, authorRole, content } = req.body;
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.comments.push({ author, authorRole: authorRole || 'Member', content });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Error adding comment' });
  }
});

module.exports = router;
