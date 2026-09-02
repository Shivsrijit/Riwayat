const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  englishName: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  region: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  heritage: { type: String, default: 'Cultural Heritage' },
  bestTime: { type: String, default: 'October to March' },
  entryFee: { type: String, default: 'Free' },
  highlights: [{ type: String }],
  link: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Destination', destinationSchema);