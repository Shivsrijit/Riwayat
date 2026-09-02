const mongoose = require('mongoose');

const recentEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  region: { type: String },
  date: { type: Date, required: true },
  category: { type: String, default: 'Festival' },
  link: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RecentEvent', recentEventSchema);