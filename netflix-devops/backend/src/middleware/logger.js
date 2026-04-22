// Request logging middleware
const logger = (req, res, next) => {
  const startTime = Date.now();
  const method = req.method;
  const path = req.path;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Log response after it's sent
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    const statusColor = status >= 400 ? '❌' : status >= 300 ? '⚠️' : '✅';
    
    console.log(`${statusColor} [${new Date().toISOString()}] ${method} ${path} - Status: ${status} - ${duration}ms - IP: ${ip}`);
  });

  next();
};

module.exports = logger;
