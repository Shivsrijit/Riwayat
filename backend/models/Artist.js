const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  craft: { type: String, required: true },
  region: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  experienceYears: { type: Number, default: 15 },
  rating: { type: Number, default: 4.9 },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  achievements: [{ type: String }],
  specialties: [{ type: String }],
  story: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Artist', artistSchema);