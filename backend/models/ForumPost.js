const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  authorRole: { type: String, default: 'Cultural Enthusiast' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const forumPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorRole: { type: String, default: 'Member' },
  category: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  comments: [commentSchema],
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ForumPost', forumPostSchema);
