require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const prometheus = require('./middleware/prometheus');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use(prometheus.httpRequestDurationMicroseconds);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/netflix-auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Auth Service: MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Auth Service: SIGTERM received');
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

// Routes
app.use('/auth', authRoutes);

// Metrics
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', prometheus.register.contentType);
    res.end(await prometheus.register.metrics());
  } catch (error) {
    console.error('Failed to collect auth metrics:', error);
    res.status(500).json({ error: 'Failed to collect metrics' });
  }
});

// Health checks for Kubernetes
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'auth' });
});

app.get('/readyz', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ status: 'ready', service: 'auth' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
