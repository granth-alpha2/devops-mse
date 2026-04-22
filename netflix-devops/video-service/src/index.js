require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const prometheus = require('./middleware/prometheus');
const videoRoutes = require('./routes/videos');

const app = express();

app.use(cors());
app.use(express.json());
app.use(prometheus.httpRequestDurationMicroseconds);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/netflix-videos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Video Service: MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Video Service: SIGTERM received');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

// Routes
app.use('/videos', videoRoutes);

// Metrics
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', prometheus.register.contentType);
    res.end(await prometheus.register.metrics());
  } catch (error) {
    console.error('Failed to collect video metrics:', error);
    res.status(500).json({ error: 'Failed to collect metrics' });
  }
});

// Health checks
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'video' });
});

app.get('/readyz', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ status: 'ready', service: 'video' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Video service running on port ${PORT}`);
});
