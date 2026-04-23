const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String },
  thumbnail: { type: String, required: true },
  url: { type: String, required: true },
  qualities: {
    '480p': { type: String },
    '720p': { type: String },
    '1080p': { type: String }
  },
  duration: { type: Number, min: 0 },
  genre: { type: String },
  rating: { type: Number, min: 0, max: 10 },
  year: { type: Number },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Text index for efficient search
videoSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Video', videoSchema);
