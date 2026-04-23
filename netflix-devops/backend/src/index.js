require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const prometheus = require('./middleware/prometheus');
const logger = require('./middleware/logger');
const Video = require('./models/Video');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const healthRoutes = require('./routes/health');

const app = express();

const DEMO_USER = {
  name: process.env.DEMO_USER_NAME || 'Netflix Demo User',
  email: process.env.DEMO_USER_EMAIL || 'demo@netflix.local',
  password: process.env.DEMO_USER_PASSWORD || 'demo123',
  subscriptionTier: process.env.DEMO_USER_TIER || 'premium',
};

async function seedDemoUser() {
  try {
    let user = await User.findOne({ email: DEMO_USER.email });

    if (!user) {
      user = new User(DEMO_USER);
      await user.save();
      console.log(`Seeded demo user: ${DEMO_USER.email}`);
      return;
    }

    const passwordMatches = await user.comparePassword(DEMO_USER.password);
    let hasChanges = false;

    if (user.name !== DEMO_USER.name) {
      user.name = DEMO_USER.name;
      hasChanges = true;
    }

    if (user.subscriptionTier !== DEMO_USER.subscriptionTier) {
      user.subscriptionTier = DEMO_USER.subscriptionTier;
      hasChanges = true;
    }

    if (!passwordMatches) {
      user.password = DEMO_USER.password;
      hasChanges = true;
    }

    if (hasChanges) {
      await user.save();
      console.log(`Updated demo user: ${DEMO_USER.email}`);
    } else {
      console.log(`Demo user ready: ${DEMO_USER.email}`);
    }
  } catch (error) {
    console.error('Failed to seed demo user:', error);
  }
}

async function seedVideos() {
  try {
    // Only seed if the collection is empty — don't wipe on every restart
    const existingCount = await Video.countDocuments();
    if (existingCount > 0) {
      console.log(`Video catalog already has ${existingCount} videos, skipping seed.`);
      return;
    }

    const sampleVideos = [
      {
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
        thumbnail: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
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
        views: 5200000
      },
      {
        title: 'Avatar: The Way of Water',
        description: 'Jake Sully and his family must escape the Pandoran colonists on the lush moon. They explore the world of the ocean and its wonders.',
        thumbnail: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
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
        views: 8900000
      },
      {
        title: 'Killers of the Flower Moon',
        description: 'When oil is discovered beneath their land, the Osage people are murdered one by one. An FBI agent investigates these mysterious deaths.',
        thumbnail: 'https://image.tmdb.org/t/p/w500/dB6Krk806zeqd0YNp2ngQ9zXznH.jpg',
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
        views: 3400000
      },
      {
        title: 'Barbie',
        description: 'Barbie and Ken escape from the perfect world of Barbie Land and enter the real world. They discover what happens when they exist outside their universe.',
        thumbnail: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
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
        views: 9100000
      },
      {
        title: 'Dune: Part Two',
        description: 'Paul Atreides must travel to the dangerous desert planet Arrakis to ensure the future of his family. Epic space opera with stunning visuals.',
        thumbnail: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
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
        views: 7300000
      },
      {
        title: 'Mission: Impossible - Dead Reckoning',
        description: 'Ethan Hunt and his team take on their most dangerous mission yet against an artificial intelligence threat to humanity.',
        thumbnail: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYdd9hzW.jpg',
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
        views: 4800000
      },
      {
        title: 'Aquaman and the Lost Kingdom',
        description: 'Aquaman must unite the kingdoms of the sea to prevent an ancient enemy from destroying the world above and below the oceans.',
        thumbnail: 'https://image.tmdb.org/t/p/w500/7lTnXOy0iNtMiIRjlFj8bQ3ZJJg.jpg',
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
        views: 5100000
      },
      {
        title: 'The Hunger Games: Ballad of Songbirds',
        description: 'A young Coriolanus Snow becomes the mentor for a female tribute in the tenth Hunger Games tournament.',
        thumbnail: 'https://image.tmdb.org/t/p/w500/eaiUgfhYPqqYD5bBghpL7V9XCqL.jpg',
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
        views: 6200000
      },
      {
        title: 'Fast X',
        description: 'Dom Toretto and his crew face off against a cunning new adversary who emerges from the shadows of their past.',
        thumbnail: 'https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg',
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
        views: 8700000
      },
      {
        title: 'Inside Out 2',
        description: 'Riley enters her teenage years, and her emotions must adjust to her changing emotions and experiences of growing up.',
        thumbnail: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
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
        views: 7900000
      },
      {
        title: 'Dungeons & Dragons: Honor Among Thieves',
        description: 'A ragtag group of thieves must embark on an epic adventure to recover a magical artifact and save the kingdom.',
        thumbnail: 'https://image.tmdb.org/t/p/w500/A7AoNT06aRAc4SV89Dwxj3EYAgC.jpg',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        qualities: {
          '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '720p': 'https://www.w3schools.com/html/movie.mp4',
          '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        duration: 134,
        genre: 'Action, Adventure, Comedy, Fantasy',
        rating: 6.8,
        year: 2023,
        views: 3200000
      },
      {
        title: 'Spider-Man: Across the Spider-Verse',
        description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
        thumbnail: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        qualities: {
          '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '720p': 'https://www.w3schools.com/html/movie.mp4',
          '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        duration: 140,
        genre: 'Animation, Action, Adventure, Sci-Fi',
        rating: 8.6,
        year: 2023,
        views: 6450000
      }
    ];

    await Video.insertMany(sampleVideos);
    console.log(`Seeded ${sampleVideos.length} sample videos`);
  } catch (error) {
    console.error('Failed to seed videos:', error);
  }
}

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigins === '*' ? '*' : allowedOrigins.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: allowedOrigins !== '*',
  optionsSuccessStatus: 200
}));
app.use(logger);
app.use(express.json({ limit: '10mb' }));
app.use(prometheus.httpRequestDurationMicroseconds);

// Rate limiting
let rateLimit;
try {
  rateLimit = require('express-rate-limit');
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
  });
  app.use('/api/', limiter);
  console.log('Rate limiting enabled');
} catch (e) {
  console.log('express-rate-limit not installed, skipping rate limiting');
}

// Security headers
try {
  const helmet = require('helmet');
  app.use(helmet({ contentSecurityPolicy: false }));
  console.log('Helmet security headers enabled');
} catch (e) {
  console.log('helmet not installed, skipping security headers');
}

// Streaming headers
app.use((req, res, next) => {
  res.header('Accept-Ranges', 'bytes');
  next();
});

// Serve static video files
app.use('/videos', express.static(path.join(__dirname, '../public/videos')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/netflix')
.then(async () => {
  console.log('MongoDB connected');
  await seedDemoUser();
  await seedVideos();
})
.catch(err => console.error('MongoDB connection error:', err));

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing connections');
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

// Video proxy endpoint to bypass CORS
app.get('/api/stream/:videoId', async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video || !video.url) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const https = require('https');
    const http = require('http');
    const requestHeaders = {};

    if (req.headers.range) {
      requestHeaders.Range = req.headers.range;
    }

    const streamFromUrl = (videoUrl, redirectCount = 0) => {
      if (redirectCount > 5) {
        if (!res.headersSent) {
          res.status(502).json({ error: 'Too many redirects while fetching video stream' });
        }
        return null;
      }

      const protocol = videoUrl.startsWith('https') ? https : http;

      const upstreamRequest = protocol.get(videoUrl, { headers: requestHeaders }, (videoRes) => {
        const statusCode = videoRes.statusCode || 500;
        const location = videoRes.headers.location;

        if ([301, 302, 303, 307, 308].includes(statusCode) && location) {
          videoRes.resume();
          const redirectedUrl = new URL(location, videoUrl).toString();
          return streamFromUrl(redirectedUrl, redirectCount + 1);
        }

        if (statusCode >= 400) {
          console.error('Upstream video response failed:', statusCode, videoUrl);
          return res.status(statusCode).json({ error: 'Failed to fetch video stream' });
        }

        const headersToForward = [
          'content-type', 'content-length', 'content-range',
          'accept-ranges', 'cache-control', 'etag', 'last-modified'
        ];

        res.status(statusCode);
        res.setHeader('Access-Control-Allow-Origin', '*');

        headersToForward.forEach((headerName) => {
          const headerValue = videoRes.headers[headerName];
          if (headerValue) {
            res.setHeader(headerName, headerValue);
          }
        });

        if (!videoRes.headers['accept-ranges']) {
          res.setHeader('Accept-Ranges', 'bytes');
        }

        videoRes.pipe(res);
      });

      upstreamRequest.on('error', (err) => {
        console.error('Stream proxy error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to stream video' });
        } else {
          res.end();
        }
      });

      return upstreamRequest;
    };

    let activeRequest = streamFromUrl(video.url);

    req.on('close', () => {
      if (activeRequest) {
        activeRequest.destroy();
      }
    });
  } catch (error) {
    console.error('Video stream route error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/health', healthRoutes);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', prometheus.register.contentType);
    res.end(await prometheus.register.metrics());
  } catch (error) {
    console.error('Failed to collect backend metrics:', error);
    res.status(500).json({ error: 'Failed to collect metrics' });
  }
});

// Health check for Kubernetes
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Readiness check for Kubernetes
app.get('/readyz', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
