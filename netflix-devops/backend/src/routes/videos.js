const express = require('express');
const Video = require('../models/Video');
const auth = require('../middleware/auth');

const router = express.Router();

// Cache middleware for GET requests
const cacheMiddleware = (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600'); // 5 min client, 10 min server
  res.setHeader('ETag', `"${Date.now()}"`);
  next();
};

// Get all videos with improved pagination and filtering
router.get('/', cacheMiddleware, async (req, res) => {
  try {
    const { genre, limit = 20, skip = 0, search } = req.query;
    const parsedLimit = Math.min(parseInt(limit) || 20, 100); // Max 100 per page
    const parsedSkip = Math.max(parseInt(skip) || 0, 0);
    
    // Build query
    const query = {};
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' }; // Case-insensitive genre search
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get total count for pagination
    const total = await Video.countDocuments(query);
    
    // Fetch videos
    const videos = await Video.find(query)
      .limit(parsedLimit)
      .skip(parsedSkip)
      .sort({ createdAt: -1 })
      .lean() // Use lean for faster queries
      .exec();
    
    res.json({
      data: videos,
      pagination: {
        total,
        limit: parsedLimit,
        skip: parsedSkip,
        pages: Math.ceil(total / parsedLimit)
      },
      meta: {
        cached: false,
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

// Get video by ID with better error handling
router.get('/:id', cacheMiddleware, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid video ID format' });
    }
    
    const video = await Video.findById(req.params.id).lean();
    if (!video) {
      return res.status(404).json({ 
        error: 'Video not found',
        id: req.params.id 
      });
    }
    
    // Update views asynchronously (don't wait for it)
    Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).catch(err => 
      console.error('Failed to update views:', err)
    );
    
    res.json({
      data: video,
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Video details error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch video details',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create video (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, thumbnail, url, duration, genre, rating } = req.body;
    
    const video = new Video({
      title,
      description,
      thumbnail,
      url,
      duration,
      genre,
      rating,
    });
    
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
