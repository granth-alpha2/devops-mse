const express = require('express');
const Video = require('../models/Video');
const auth = require('../middleware/auth');

const router = express.Router();

// Cache middleware for GET requests
const cacheMiddleware = (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
  next();
};

// Get all videos with pagination and filtering
router.get('/', cacheMiddleware, async (req, res) => {
  try {
    const { genre, limit = 20, skip = 0, search } = req.query;
    const parsedLimit = Math.min(parseInt(limit) || 20, 100);
    const parsedSkip = Math.max(parseInt(skip) || 0, 0);
    
    const query = {};
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const total = await Video.countDocuments(query);
    const videos = await Video.find(query)
      .limit(parsedLimit)
      .skip(parsedSkip)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    
    // Generate a content-based ETag
    const crypto = require('crypto');
    const etag = crypto.createHash('md5').update(JSON.stringify(videos)).digest('hex');
    res.setHeader('ETag', `"${etag}"`);

    res.json({
      data: videos,
      pagination: {
        total,
        limit: parsedLimit,
        skip: parsedSkip,
        pages: Math.ceil(total / parsedLimit)
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Videos list error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch videos',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get video by ID
router.get('/:id', cacheMiddleware, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid video ID format' });
    }
    
    const video = await Video.findById(req.params.id).lean();
    if (!video) {
      return res.status(404).json({ error: 'Video not found', id: req.params.id });
    }
    
    // Update views asynchronously
    Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).catch(err => 
      console.error('Failed to update views:', err)
    );
    
    res.json({
      data: video,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    console.error('Video details error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch video details',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create video (authenticated)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, thumbnail, url, duration, genre, rating, year } = req.body;
    
    if (!title || !url || !thumbnail) {
      return res.status(400).json({ error: 'title, url, and thumbnail are required' });
    }

    const video = new Video({ title, description, thumbnail, url, duration, genre, rating, year });
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update video (authenticated)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid video ID format' });
    }

    const updates = req.body;
    updates.updatedAt = new Date();

    const video = await Video.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete video (authenticated)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid video ID format' });
    }

    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json({ message: 'Video deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
