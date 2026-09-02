const mongoose = require('mongoose');

const featuredStorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, default: '' },
  image: { type: String, required: true },
  videoUrl: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['art', 'food', 'festivals', 'monuments', 'traditions', 'dance', 'music', 'medicine', 'handicrafts'], 
    required: true 
  },
  region: { type: String, required: true },
  author: { type: String, required: true },
  authorRole: { type: String, default: 'Cultural Journalist' },
  readTime: { type: String, default: '5 min read' },
  link: { type: String, default: '' },
  upvotes: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeaturedStory', featuredStorySchema);