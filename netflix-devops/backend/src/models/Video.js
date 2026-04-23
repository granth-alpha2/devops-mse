const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String },
  url: { type: String, required: true },
  qualities: {
    '480p': { type: String },
    '720p': { type: String },
    '1080p': { type: String }
  },
  duration: { type: Number },
  genre: { type: String },
  rating: { type: Number },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Video', videoSchema);
