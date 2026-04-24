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

    let total, videos;

    try {
      total = await Video.countDocuments(query);
      videos = await Video.find(query)
        .limit(parsedLimit)
        .skip(parsedSkip)
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    } catch (dbError) {
      console.log('Database not available, using mock data');
      // Fallback to mock data when database is not available
      const mockVideos = [
        {
          _id: '1',
          title: 'Oppenheimer',
          description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
          thumbnail: 'https://picsum.photos/300/450?random=1',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          qualities: {
            '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
            '720p': 'https://www.w3schools.com/html/mov_bbb.mp4',
            '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
          },
          duration: 150,
          genre: 'Drama, Biography, History',
          rating: 8.5,
          year: 2023,
          views: 5200000,
          createdAt: new Date()
        },
        {
          _id: '2',
          title: 'Avatar: The Way of Water',
          description: 'Jake Sully and his family must escape the Pandoran colonists on the lush moon. They explore the world of the ocean and its wonders.',
          thumbnail: 'https://picsum.photos/300/450?random=2',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          qualities: {
            '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
            '720p': 'https://www.w3schools.com/html/movie.mp4',
            '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
          },
          duration: 192,
          genre: 'Sci-Fi, Action, Adventure',
          rating: 7.9,
          year: 2022,
          views: 8900000,
          createdAt: new Date()
        },
        {
          _id: '3',
          title: 'Killers of the Flower Moon',
          description: 'When oil is discovered beneath their land, the Osage people are murdered one by one. An FBI agent investigates these mysterious deaths.',
          thumbnail: 'https://picsum.photos/300/450?random=3',
          url: 'https://www.w3schools.com/html/movie.mp4',
          qualities: {
            '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
            '720p': 'https://www.w3schools.com/html/movie.mp4',
            '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
          },
          duration: 206,
          genre: 'Crime, Drama, History',
          rating: 8.3,
          year: 2023,
          views: 3400000,
          createdAt: new Date()
        },
        {
          _id: '4',
          title: 'Barbie',
          description: 'Barbie and Ken escape from the perfect world of Barbie Land and enter the real world. They discover what happens when they exist outside their universe.',
          thumbnail: 'https://picsum.photos/300/450?random=4',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          qualities: {
            '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
            '720p': 'https://www.w3schools.com/html/mov_bbb.mp4',
            '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
          },
          duration: 114,
          genre: 'Comedy, Fantasy',
          rating: 7.8,
          year: 2023,
          views: 9100000,
          createdAt: new Date()
        },
        {
          _id: '5',
          title: 'Dune: Part Two',
          description: 'Paul Atreides must travel to the dangerous desert planet Arrakis to ensure the future of his family. Epic space opera with stunning visuals.',
          thumbnail: 'https://picsum.photos/300/450?random=5',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          qualities: {
            '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
            '720p': 'https://www.w3schools.com/html/mov_bbb.mp4',
            '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
          },
          duration: 166,
          genre: 'Sci-Fi, Action, Adventure',
          rating: 8.1,
          year: 2024,
          views: 7300000,
          createdAt: new Date()
        },
        {
          _id: '6',
          title: 'Mission: Impossible - Dead Reckoning',
          description: 'Ethan Hunt and his team take on their most dangerous mission yet against an artificial intelligence threat to humanity.',
          thumbnail: 'https://picsum.photos/300/450?random=6',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          qualities: {
            '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
            '720p': 'https://www.w3schools.com/html/movie.mp4',
            '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
          },
          duration: 163,
          genre: 'Action, Adventure, Thriller',
          rating: 7.6,
          year: 2023,
          views: 4800000,
          createdAt: new Date()
        },
        {
          _id: '7',
          title: 'Aquaman and the Lost Kingdom',
          description: 'Aquaman must unite the kingdoms of the sea to prevent an ancient enemy from destroying the world above and below the oceans.',
          thumbnail: 'https://picsum.photos/300/450?random=7',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          qualities: {
            '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
            '720p': 'https://www.w3schools.com/html/movie.mp4',
            '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
          },
          duration: 124,
          genre: 'Action, Adventure, Fantasy',
          rating: 6.9,
          year: 2023,
          views: 5100000,
          createdAt: new Date()
        },
        {
          _id: '8',
          title: 'The Hunger Games: Ballad of Songbirds',
          description: 'A young Coriolanus Snow becomes the mentor for a female tribute in the tenth Hunger Games tournament.',
          thumbnail: 'https://picsum.photos/300/450?random=8',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          qualities: {
            '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
            '720p': 'https://www.w3schools.com/html/mov_bbb.mp4',
            '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
          },
          duration: 157,
          genre: 'Action, Adventure, Drama, Sci-Fi',
          rating: 7.7,
          year: 2023,
          views: 6200000,
          createdAt: new Date()
        },
        {
          _id: '9',
          title: 'Fast X',
          description: 'Dom Toretto and his crew face off against a cunning new adversary who emerges from the shadows of their past.',
          thumbnail: 'https://picsum.photos/300/450?random=9',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          qualities: {
            '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
            '720p': 'https://www.w3schools.com/html/movie.mp4',
            '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
          },
          duration: 141,
          genre: 'Action, Crime, Thriller',
          rating: 6.5,
          year: 2023,
          views: 8700000,
          createdAt: new Date()
        },
        {
          _id: '10',
          title: 'Inside Out 2',
          description: 'Riley enters her teenage years, and her emotions must adjust to her changing emotions and experiences of growing up.',
          thumbnail: 'https://picsum.photos/300/450?random=10',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          qualities: {
            '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
            '720p': 'https://www.w3schools.com/html/movie.mp4',
            '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
          },
          duration: 96,
          genre: 'Animation, Adventure, Comedy',
          rating: 8.2,
          year: 2024,
          views: 7900000,
          createdAt: new Date()
        }
      ];

      // Apply filtering
      let filteredVideos = mockVideos;
      if (genre) {
        filteredVideos = mockVideos.filter(v => v.genre.toLowerCase().includes(genre.toLowerCase()));
      }
      if (search) {
        filteredVideos = filteredVideos.filter(v =>
          v.title.toLowerCase().includes(search.toLowerCase()) ||
          v.description.toLowerCase().includes(search.toLowerCase())
        );
      }

      total = filteredVideos.length;
      videos = filteredVideos.slice(parsedSkip, parsedSkip + parsedLimit);
    }

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
      }
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
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
