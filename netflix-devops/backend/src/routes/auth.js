const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'netflix-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'User created successfully', 
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if database is available
    let user;
    try {
      user = await User.findOne({ email });
    } catch (dbError) {
      console.log('Database not available for auth, using mock data');
      // Fallback to mock user
      const mockUser = {
        _id: 'demo-user-id',
        name: 'Netflix Demo User',
        email: 'demo@netflix.local',
        subscriptionTier: 'premium'
      };

      if (email === 'demo@netflix.local' && password === 'demo123') {
        const token = jwt.sign(
          { id: mockUser._id, email: mockUser.email },
          process.env.JWT_SECRET || 'netflix-secret',
          { expiresIn: '7d' }
        );

        return res.json({
          message: 'Login successful',
          token,
          user: { id: mockUser._id, name: mockUser.name, email: mockUser.email }
        });
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'netflix-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    // Check if database is available
    let user;
    try {
      user = await User.findById(req.userId);
    } catch (dbError) {
      console.log('Database not available for auth, using mock data');
      // Fallback to mock user
      const mockUser = {
        _id: 'demo-user-id',
        name: 'Netflix Demo User',
        email: 'demo@netflix.local',
        subscriptionTier: 'premium'
      };

      return res.json({
        id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        subscriptionTier: mockUser.subscriptionTier
      });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      subscriptionTier: user.subscriptionTier
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
