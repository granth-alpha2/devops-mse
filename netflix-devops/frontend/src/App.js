import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoGrid from './components/VideoGrid';

function App() {
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const DEMO_CREDENTIALS = {
    email: process.env.REACT_APP_DEMO_USER_EMAIL || 'demo@netflix.local',
    password: process.env.REACT_APP_DEMO_USER_PASSWORD || 'demo123',
  };

  useEffect(() => {
    initializeApp();
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
        console.error('Stored token is invalid, logging in with demo account:', err);
        localStorage.removeItem('token');

        try {
          const response = await axios.post(`${API_URL}/auth/login`, DEMO_CREDENTIALS);
          localStorage.setItem('token', response.data.token);
          setUser(response.data.user);
          return;
        } catch (loginErr) {
          console.error('Demo login failed:', loginErr);
        }
      } else {
        console.error('Demo login failed:', err);
      }

      setError('Failed to sign in with the demo account');
    } finally {
      setAuthenticating(false);
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/videos`, {
        params: { limit: 20 },
        timeout: 10000
      });
      
      // Handle both old format (array) and new format (object with data property)
      const videoData = response.data.data || response.data;
      setVideos(Array.isArray(videoData) ? videoData : []);
      
      if (Array.isArray(videoData) && videoData.length === 0) {
        setError('No videos available. Please try again later.');
      }
    } catch (err) {
      console.error('Failed to load videos:', err);
      
      let errorMsg = 'Failed to load videos. ';
      if (err.response?.status === 404) {
        errorMsg += 'Videos service is unavailable.';
      } else if (err.code === 'ECONNABORTED') {
        errorMsg += 'Request timed out. Check your connection.';
      } else if (err.message === 'Network Error') {
        errorMsg += 'Network error. Is the API running?';
      } else {
        errorMsg += 'Please try again later.';
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="App">
      <Header user={user} onLogout={handleLogout} />
      <Hero />
      
      {authenticating ? (
        <div className="loading">Signing in with demo account...</div>
      ) : loading ? (
        <div className="loading">Loading videos...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <VideoGrid videos={videos} />
      )}
    </div>
  );
}

export default App;
