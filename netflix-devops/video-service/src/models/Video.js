const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String },
  thumbnail: { type: String },
  streamUrl: { type: String, required: true },
  duration: { type: Number },
  genre: [{ type: String }],
  rating: { type: Number, min: 0, max: 10 },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  uploadedBy: { type: String },
  resolution: [{ type: String, enum: ['360p', '480p', '720p', '1080p', '4K'] }],
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('StreamingVideo', videoSchema);
