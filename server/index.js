/**
 * Gouden Adelaar - Express Server
 * Productie-grade backend voor bouw- en renovatiewebsite
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const emailService = require('./services/emailService');
const fileService = require('./services/fileService');
const formRoutes = require('./routes/forms');
const reviewRoutes = require('./routes/reviews');
const database = require('./services/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy voor rate limiter (belangrijk voor Render)
app.set('trust proxy', 1);

// ─── Middleware ──────────────────────────────────────────

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "https:", "data:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
      connectSrc: ["'self'", "https://api.emailjs.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS - sta verzoeken toe van dezelfde origin
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://gouden-adelaar.nl', `http://localhost:${PORT}`]
    : '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Request logging (alleen in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Statische bestanden ────────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '30d' : 0,
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // CSS en JS langer cachen in productie
    if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
      res.setHeader('Cache-Control', `public, max-age=${process.env.NODE_ENV === 'production' ? '31536000' : '0'}, immutable`);
    }
  }
}));

// ─── API Routes ─────────────────────────────────────────
app.use('/api', formRoutes);
app.use('/api/reviews', reviewRoutes);

// ─── SPA fallback ───────────────────────────────────────
// Alleen niet-API routes zonder bestandsextensie naar index.html sturen
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'Endpoint niet gevonden' });
  }

  // Als het pad een bestandsextensie heeft, stuur 404
  const ext = path.extname(req.path);
  if (ext) {
    return res.status(404).sendFile(path.join(__dirname, '..', 'public', '404.html'));
  }

  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ─── Error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server] Onverwachte fout:', err);

  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Aangevraagde data is te groot'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Interne serverfout. Probeer het later opnieuw.'
  });
});

// Database connectie
database.connect();

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║         🦅 G O U D E N   A D E L A A R         ║
  ║          Bouw & Renovatie - Webserver            ║
  ╠══════════════════════════════════════════════════╣
  ║  Status:   🟢 Online                            ║
  ║  Poort:    ${String(PORT).padEnd(38)}║
  ║  Modus:    ${String(process.env.NODE_ENV || 'development').padEnd(38)}║
  ║  URL:      ${String(`http://localhost:${PORT}`).padEnd(38)}║
  ╚══════════════════════════════════════════════════╝
  `);

  // Initialiseer email service
  emailService.init();

  // Schedule: opschonen oude uploads elke dag
  setInterval(() => fileService.cleanOldUploads(), 24 * 60 * 60 * 1000);
});

// ─── Graceful shutdown ────────────────────────────────
process.on('SIGINT', () => {
  console.log('\n[Server] Server wordt afgesloten...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[Server] Server wordt afgesloten...');
  process.exit(0);
});

module.exports = app;

