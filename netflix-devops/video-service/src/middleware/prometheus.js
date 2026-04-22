const prometheus = require('prom-client');

const register = prometheus.register;
prometheus.collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

const videoStreamingCounter = new prometheus.Counter({
  name: 'video_streams_total',
  help: 'Total number of video streams',
  labelNames: ['video_id', 'resolution'],
  registers: [register],
});

const requestHandler = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });

  next();
};

module.exports = {
  register,
  httpRequestDurationMicroseconds: requestHandler,
  videoStreamingCounter,
};
