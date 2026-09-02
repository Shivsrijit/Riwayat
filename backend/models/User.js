const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['visitor', 'creator', 'artisan', 'admin'], 
    default: 'visitor' 
  },
  bio: { type: String, default: '' },
  region: { type: String, default: '' },
  avatar: { type: String, default: '' },
  savedStories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FeaturedStory' }],
  enrolledWorkshops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' }],
  createdStories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FeaturedStory' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);