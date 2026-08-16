require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/databases', require('./routes/databases'));
app.use('/api/backups', require('./routes/backups'));
app.use('/api/monitoring', require('./routes/monitoring'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/keys', require('./routes/keys'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/auth', require('./routes/auth'));

// Serve static files from parent directory (index.html, documentation)
app.use(express.static(path.join(__dirname, '..')));

// API documentation
app.get('/api/docs', (req, res) => {
  res.json({
    version: '1.0.0',
    description: 'GRT SysAdmin Operations Console API',
    endpoints: {
      health: 'GET /api/health',
      databases: {
        list: 'GET /api/databases',
        create: 'POST /api/databases',
        get: 'GET /api/databases/:id',
        update: 'PUT /api/databases/:id',
        delete: 'DELETE /api/databases/:id'
      },
      backups: {
        list: 'GET /api/backups',
        create: 'POST /api/backups',
        get: 'GET /api/backups/:id',
        update: 'PUT /api/backups/:id',
        delete: 'DELETE /api/backups/:id'
      },
      monitoring: {
        metrics: 'GET /api/monitoring/metrics',
        health: 'GET /api/monitoring/health',
        timeline: 'GET /api/monitoring/timeline'
      },
      alerts: {
        list: 'GET /api/alerts',
        create: 'POST /api/alerts',
        acknowledge: 'PUT /api/alerts/:id/acknowledge',
        resolve: 'PUT /api/alerts/:id/resolve'
      },
      audit: {
        logs: 'GET /api/audit/logs',
        export: 'GET /api/audit/export'
      },
      auth: {
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        verify: 'GET /api/auth/verify'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    status: 404
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  GRT SysAdmin Operations API               ║
║  Server started successfully               ║
╠════════════════════════════════════════════╣
║  URL: http://localhost:${PORT}                    ║
║  Environment: ${process.env.NODE_ENV || 'development'}                  ║
║  Docs: http://localhost:${PORT}/api/docs              ║
╚════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
