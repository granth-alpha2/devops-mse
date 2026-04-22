const express = require('express');
const Video = require('../models/Video');

const router = express.Router();

// Get all videos with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, genre, search } = req.query;
    const query = {};

    if (genre) query.genre = genre;
    if (search) query.title = { $regex: search, $options: 'i' };

    const videos = await Video.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Video.countDocuments(query);

    res.json({
      videos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trending videos
router.get('/trending', async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ views: -1 })
      .limit(10);

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get video by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create video
router.post('/', async (req, res) => {
  try {
    const { title, description, thumbnail, streamUrl, duration, genre, rating, uploadedBy } = req.body;

    if (!title || !streamUrl) {
      return res.status(400).json({ error: 'Title and streamUrl are required' });
    }

    const video = new Video({
      title,
      description,
      thumbnail,
      streamUrl,
      duration,
      genre: Array.isArray(genre) ? genre : [genre],
      rating,
      uploadedBy,
    });

    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update video
router.put('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like video
router.post('/:id/like', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({ message: 'Video liked', likes: video.likes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
