const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true },
  craftType: { type: String, required: true },
  region: { type: String, required: true },
  image: { type: String, required: true },
  artisanName: { type: String, required: true },
  artisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 12 },
  stock: { type: Number, default: 10 },
  highlights: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
