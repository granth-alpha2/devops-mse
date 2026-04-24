import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoGrid from './components/VideoGrid';
import Footer from './components/Footer';

function App() {
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const DEMO_CREDENTIALS = {
    email: process.env.REACT_APP_DEMO_USER_EMAIL || 'demo@netflix.local',
    password: process.env.REACT_APP_DEMO_USER_PASSWORD || 'demo123',
  };

  useEffect(() => {
    initializeApp();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const initializeApp = async () => {
    await ensureDemoLogin();
    await fetchVideos();
  };

  const ensureDemoLogin = async () => {
    const token = localStorage.getItem('token');

    try {
      if (token) {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        return;
      }

      const response = await axios.post(`${API_URL}/auth/login`, DEMO_CREDENTIALS);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (err) {
      if (token) {
        localStorage.removeItem('token');
        try {
          const response = await axios.post(`${API_URL}/auth/login`, DEMO_CREDENTIALS);
          localStorage.setItem('token', response.data.token);
          setUser(response.data.user);
          return;
        } catch (loginErr) {
          console.error('Demo login failed:', loginErr);
        }
      }
      setError('Failed to sign in with the demo account');
    } finally {
      setAuthenticating(false);
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/videos`, {
        params: { limit: 20 },
        timeout: 10000
      });
      
      const videoData = response.data.videos || response.data.data || response.data;
      const videosArray = Array.isArray(videoData) ? videoData : [];
      
      setVideos(videosArray);
      
      if (videosArray.length === 0) {
        setError('No videos available right now. Our catalog is being updated.');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Failed to load videos:', err);
      setVideos([]);
      setError('Unable to load videos. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFilteredVideos = () => {
    let filtered = videos;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(video =>
        video.genre.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const categories = [
    { id: 'all', label: 'All', icon: '🎬' },
    { id: 'action', label: 'Action', icon: '💥' },
    { id: 'drama', label: 'Drama', icon: '🎭' },
    { id: 'sci-fi', label: 'Sci-Fi', icon: '🚀' },
    { id: 'animation', label: 'Animation', icon: '🎨' },
    { id: 'adventure', label: 'Adventure', icon: '🗺️' },
    { id: 'comedy', label: 'Comedy', icon: '😂' },
    { id: 'thriller', label: 'Thriller', icon: '🔪' },
    { id: 'horror', label: 'Horror', icon: '👻' },
    { id: 'romance', label: 'Romance', icon: '💕' },
  ];

  return (
    <div className="App">
      <Header user={user} onLogout={handleLogout} onSearch={setSearchQuery} searchQuery={searchQuery} />
      {!authenticating && <Hero videos={videos} />}
      
      <section className="main-content">
        <div className="container">
          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
              <button onClick={() => { setError(null); fetchVideos(); }}>Retry</button>
            </div>
          )}

          <div className="categories-section">
            <h3 className="section-title">Browse by Category</h3>
            <div className="categories">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  title={`Browse ${cat.label}`}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading your next favorite movie...</p>
            </div>
          ) : (
            <VideoGrid videos={getFilteredVideos()} />
          )}
        </div>
      </section>

      <Footer />

      <button
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        title="Back to top"
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </div>
  );
}

export default App;
