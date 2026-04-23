require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
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

// TMDB API function to get trailer URLs
async function getTrailerUrl(movieTitle, year = null) {
  try {
    // TMDB API key - using a demo key (replace with your own for production)
    const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZjQ4ZjQ4ZjQ4ZjQ4ZjQ4ZjQ4ZjQ4ZjQ4ZjQ4ZjQ4ZiIsInN1YiI6IjEyMzQ1Njc4OTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.example';

    // Search for the movie
    const searchResponse = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: movieTitle,
        year: year
      }
    });

    if (searchResponse.data.results.length === 0) {
      console.log(`No results found for ${movieTitle}`);
      return null;
    }

    const movieId = searchResponse.data.results[0].id;

    // Get movie videos (trailers)
    const videosResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });

    // Find the best trailer (prefer YouTube, then Vimeo)
    const trailers = videosResponse.data.results.filter(video =>
      video.type === 'Trailer' && (video.site === 'YouTube' || video.site === 'Vimeo')
    );

    if (trailers.length === 0) {
      console.log(`No trailers found for ${movieTitle}`);
      return null;
    }

    const bestTrailer = trailers[0];
    let trailerUrl;

    if (bestTrailer.site === 'YouTube') {
      trailerUrl = `https://www.youtube.com/watch?v=${bestTrailer.key}`;
    } else if (bestTrailer.site === 'Vimeo') {
      trailerUrl = `https://vimeo.com/${bestTrailer.key}`;
    }

    console.log(`Found trailer for ${movieTitle}: ${trailerUrl}`);
    return trailerUrl;

  } catch (error) {
    console.error(`Error fetching trailer for ${movieTitle}:`, error.message);
    return null;
  }
}

async function seedVideos() {
  try {
    // Remove existing videos and reseed with new URLs
    await Video.deleteMany({});
    console.log('Removed existing videos');

    const sampleVideos = [
      {
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Cdefs%3E%3ClinearGradient id="g1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FFD700;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23CC0000;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="225" fill="url(%23g1)" /%3E%3Ctext x="50%25" y="50%25" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-family="Arial"%3EOppenheimer%3C/text%3E%3Ctext x="50%25" y="70%25" font-size="16" fill="rgba(255,255,255,0.8)" text-anchor="middle" font-family="Arial"%3E⭐ 8.5 Drama%3C/text%3E%3C/svg%3E',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        qualities: {
          '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '720p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        duration: 150,
        genre: 'Drama, Biography, History',
        rating: 8.5,
        views: 5200000
      },
      {
        title: 'Avatar: The Way of Water',
        description: 'Jake Sully and his family must escape the Pandoran colonists on the lush moon. They explore the world of the ocean and its wonders.',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Cdefs%3E%3ClinearGradient id="g2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%230099FF;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23001155;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="225" fill="url(%23g2)" /%3E%3Ctext x="50%25" y="50%25" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-family="Arial"%3EAvatar%3C/text%3E%3Ctext x="50%25" y="70%25" font-size="16" fill="rgba(255,255,255,0.8)" text-anchor="middle" font-family="Arial"%3E⭐ 7.9 Sci-Fi%3C/text%3E%3C/svg%3E',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        qualities: {
          '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '720p': 'https://www.w3schools.com/html/movie.mp4',
          '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        duration: 192,
        genre: 'Sci-Fi, Action, Adventure',
        rating: 7.9,
        views: 8900000
      },
      {
        title: 'Killers of the Flower Moon',
        description: 'When oil is discovered beneath their land, the Osage people are murdered one by one. An FBI agent investigates these mysterious deaths.',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Cdefs%3E%3ClinearGradient id="g3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23990000;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23330000;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="225" fill="url(%23g3)" /%3E%3Ctext x="50%25" y="50%25" font-size="28" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-family="Arial"%3EKillers of%3C/text%3E%3Ctext x="50%25" y="65%25" font-size="28" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial"%3EThe Flower Moon%3C/text%3E%3Ctext x="50%25" y="85%25" font-size="16" fill="rgba(255,255,255,0.8)" text-anchor="middle" font-family="Arial"%3E⭐ 8.3 Crime%3C/text%3E%3C/svg%3E',
        url: 'https://www.w3schools.com/html/movie.mp4',
        qualities: {
          '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '720p': 'https://www.w3schools.com/html/movie.mp4',
          '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        duration: 206,
        genre: 'Crime, Drama, History',
        rating: 8.3,
        views: 3400000
      },
      {
        title: 'Barbie',
        description: 'Barbie and Ken escape from the perfect world of Barbie Land and enter the real world. They discover what happens when they exist outside their universe.',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Cdefs%3E%3ClinearGradient id="g4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF1493;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23FF69B4;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="225" fill="url(%23g4)" /%3E%3Ctext x="50%25" y="50%25" font-size="42" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-family="Arial"%3EBarbie%3C/text%3E%3Ctext x="50%25" y="70%25" font-size="16" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-family="Arial"%3E⭐ 7.8 Comedy%3C/text%3E%3C/svg%3E',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        qualities: {
          '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '720p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        duration: 114,
        genre: 'Comedy, Fantasy',
        rating: 7.8,
        views: 9100000
      },
      {
        title: 'Dune: Part Two',
        description: 'Paul Atreides must travel to the dangerous desert planet Arrakis to ensure the future of his family. Epic space opera with stunning visuals.',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Cdefs%3E%3ClinearGradient id="g5" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FFB74D;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23CC7722;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="225" fill="url(%23g5)" /%3E%3Ctext x="50%25" y="50%25" font-size="42" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-family="Arial"%3EDune%3C/text%3E%3Ctext x="50%25" y="70%25" font-size="16" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-family="Arial"%3E⭐ 8.1 Sci-Fi%3C/text%3E%3C/svg%3E',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        qualities: {
          '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '720p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        duration: 166,
        genre: 'Sci-Fi, Action, Adventure',
        rating: 8.1,
        views: 7300000
      },
      {
        title: 'Mission: Impossible - Dead Reckoning',
        description: 'Ethan Hunt and his team take on their most dangerous mission yet against an artificial intelligence threat to humanity.',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Cdefs%3E%3ClinearGradient id="g6" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23333333;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23FF0000;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="225" fill="url(%23g6)" /%3E%3Ctext x="50%25" y="40%25" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-family="Arial"%3EMission:%3C/text%3E%3Ctext x="50%25" y="55%25" font-size="32" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial"%3EImpossible%3C/text%3E%3Ctext x="50%25" y="75%25" font-size="16" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-family="Arial"%3E⭐ 7.6 Action%3C/text%3E%3C/svg%3E',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        qualities: {
          '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '720p': 'https://www.w3schools.com/html/movie.mp4',
          '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        duration: 163,
        genre: 'Action, Adventure, Thriller',
        rating: 7.6,
        views: 4800000
      },
      {
        title: 'Aquaman and the Lost Kingdom',
        description: 'Aquaman must unite the kingdoms of the sea to prevent an ancient enemy from destroying the world above and below the oceans.',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Cdefs%3E%3ClinearGradient id="g7" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300CCFF;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23006699;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="225" fill="url(%23g7)" /%3E%3Ctext x="50%25" y="50%25" font-size="36" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-family="Arial"%3EAquaman%3C/text%3E%3Ctext x="50%25" y="70%25" font-size="16" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-family="Arial"%3E⭐ 6.9 Action%3C/text%3E%3C/svg%3E',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        qualities: {
          '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '720p': 'https://www.w3schools.com/html/movie.mp4',
          '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        duration: 124,
        genre: 'Action, Adventure, Fantasy',
        rating: 6.9,
        views: 5100000
      },
      {
        title: 'The Hunger Games: Ballad of Songbirds',
        description: 'A young Coriolanus Snow becomes the mentor for a female tribute in the tenth Hunger Games tournament.',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Cdefs%3E%3ClinearGradient id="g8" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FFD700;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23664400;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="225" fill="url(%23g8)" /%3E%3Ctext x="50%25" y="40%25" font-size="28" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-family="Arial"%3EThe Hunger%3C/text%3E%3Ctext x="50%25" y="55%25" font-size="28" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial"%3EGames%3C/text%3E%3Ctext x="50%25" y="75%25" font-size="16" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-family="Arial"%3E⭐ 7.7 Action%3C/text%3E%3C/svg%3E',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        qualities: {
          '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '720p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        duration: 157,
        genre: 'Action, Adventure, Drama, Sci-Fi',
        rating: 7.7,
        views: 6200000
      },
      {
        title: 'Fast X',
        description: 'Dom Toretto and his crew face off against a cunning new adversary who emerges from the shadows of their past.',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Cdefs%3E%3ClinearGradient id="g9" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF2020;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23000000;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="225" fill="url(%23g9)" /%3E%3Ctext x="50%25" y="50%25" font-size="52" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-family="Arial"%3EFastX%3C/text%3E%3Ctext x="50%25" y="70%25" font-size="16" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-family="Arial"%3E⭐ 6.5 Action%3C/text%3E%3C/svg%3E',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        qualities: {
          '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '720p': 'https://www.w3schools.com/html/movie.mp4',
          '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        duration: 141,
        genre: 'Action, Crime, Thriller',
        rating: 6.5,
        views: 8700000
      },
      {
        title: 'Inside Out 2',
        description: 'Riley enters her teenage years, and her emotions must adjust to her changing emotions and experiences of growing up.',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Cdefs%3E%3ClinearGradient id="g10" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%236B4DE6;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23E67E22;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="225" fill="url(%23g10)" /%3E%3Ctext x="50%25" y="50%25" font-size="36" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-family="Arial"%3EInside Out2%3C/text%3E%3Ctext x="50%25" y="70%25" font-size="16" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-family="Arial"%3E⭐ 8.2 Animation%3C/text%3E%3C/svg%3E',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        qualities: {
          '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '720p': 'https://www.w3schools.com/html/movie.mp4',
          '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        duration: 96,
        genre: 'Animation, Adventure, Comedy',
        rating: 8.2,
        views: 7900000
      },
      {
        title: 'Dungeons & Dragons: Honor Among Thieves',
        description: 'A ragtag group of thieves must embark on an epic adventure to recover a magical artifact and save the kingdom.',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Cdefs%3E%3ClinearGradient id="g11" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23884422;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23222200;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="225" fill="url(%23g11)" /%3E%3Ctext x="50%25" y="40%25" font-size="28" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-family="Arial"%3EDungeons %26%3C/text%3E%3Ctext x="50%25" y="55%25" font-size="28" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial"%3EDragons%3C/text%3E%3Ctext x="50%25" y="75%25" font-size="16" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-family="Arial"%3E⭐ 6.8 Fantasy%3C/text%3E%3C/svg%3E',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        qualities: {
          '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '720p': 'https://www.w3schools.com/html/movie.mp4',
          '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        duration: 134,
        genre: 'Action, Adventure, Comedy, Fantasy',
        rating: 6.8,
        views: 3200000
      },
      {
        title: 'Spider-Man: Across the Spider-Verse',
        description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Cdefs%3E%3ClinearGradient id="g12" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF0000;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23000080;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="225" fill="url(%23g12)" /%3E%3Ctext x="50%25" y="40%25" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-family="Arial"%3ESpider-Man:%3C/text%3E%3Ctext x="50%25" y="55%25" font-size="32" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial"%3EMultiverse%3C/text%3E%3Ctext x="50%25" y="75%25" font-size="16" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-family="Arial"%3E⭐ 8.6 Animation%3C/text%3E%3C/svg%3E',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        qualities: {
          '480p': 'https://www.w3schools.com/html/mov_bbb.mp4',
          '720p': 'https://www.w3schools.com/html/movie.mp4',
          '1080p': 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        duration: 140,
        genre: 'Animation, Action, Adventure, Sci-Fi',
        rating: 8.6,
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
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  optionsSuccessStatus: 200
}));
app.use(logger); // Add logging middleware
app.use(express.json());
app.use(prometheus.httpRequestDurationMicroseconds);

// Video CORS and streaming headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');
  res.header('Accept-Ranges', 'bytes');
  next();
});

// Serve static video files
app.use('/videos', express.static(path.join(__dirname, '../public/videos')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/netflix', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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
          'content-type',
          'content-length',
          'content-range',
          'accept-ranges',
          'cache-control',
          'etag',
          'last-modified'
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
