const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  videoUrl: { type: String, default: '' },
  description: { type: String, default: '' }
});

const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  instructorTitle: { type: String, default: 'Master Craftsman' },
  category: { type: String, required: true },
  region: { type: String, required: true },
  duration: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  rating: { type: Number, default: 4.9 },
  image: { type: String, required: true },
  price: { type: Number, default: 0 },
  lessonsCount: { type: Number, default: 5 },
  enrolledCount: { type: Number, default: 420 },
  syllabus: [lessonSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workshop', workshopSchema);
