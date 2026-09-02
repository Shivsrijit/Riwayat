const mongoose = require('mongoose');

const creatorJobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Grant', 'Full-time', 'Freelance Documentarian', 'Fellowship', 'Commission', 'Residency'], 
    default: 'Grant' 
  },
  grantAmount: { type: String, required: true },
  region: { type: String, required: true },
  deadline: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  link: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CreatorJob', creatorJobSchema);
