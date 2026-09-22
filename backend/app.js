const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
require('dotenv').config();
const dns = require('dns');

// Configure DNS Servers safely across Node.js environments
if (typeof dns.setServers === 'function') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (err) {
    console.warn('[DNS] Custom DNS configuration notice:', err.message);
  }
}

const app = express();

// 1. Security Headers via Helmet
app.use(helmet({
  contentSecurityPolicy: false, // Disabled so Leaflet OSM & Esri external tile layers load without restriction
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser clients or matched origins
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS policy restriction'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 3. Rate Limiting Protection (DDoS & Brute Force Prevention)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit login/register attempts to 30 per 15 minutes
  message: { error: 'Too many authentication attempts, please try again after 15 minutes' }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 4. Body Parser with Payload Limit
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// 5. API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/artists', require('./routes/artists'));
app.use('/api/recent-events', require('./routes/recentEvents'));
app.use('/api/featured-stories', require('./routes/featuredStories'));
app.use('/api/stories', require('./routes/featuredStories'));
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/workshops', require('./routes/workshops'));
app.use('/api/forum', require('./routes/forum'));
app.use('/api/creator-jobs', require('./routes/creatorJobs'));
app.use('/api/ai', require('./routes/ai'));

// Status & Health Check
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    security: 'active',
    message: 'RIWAYAT Secured Production REST API',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('RIWAYAT Cultural Heritage API Server is Active & Secured');
});

// Production Error Handling Middleware (Hide stack traces)
app.use((err, req, res, next) => {
  console.error('[API ERROR]', err.message);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/riwayat';
mongoose.connect(MONGO_URI)
  .then(() => console.log('[SUCCESS] MongoDB connected to RIWAYAT database'))
  .catch((err) => console.warn('[WARNING] MongoDB connection failed (fallback in-memory mode active):', err.message));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`[SERVER] RIWAYAT Server listening securely on port ${PORT}`));

module.exports = app;
