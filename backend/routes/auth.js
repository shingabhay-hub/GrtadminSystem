const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Sample user credentials (in production, use database with bcrypt)
const users = [
  {
    id: 'user-1',
    username: 'abhay.admin',
    email: 'abhay@example.com',
    role: 'admin'
  },
  {
    id: 'user-2',
    username: 'srini.dba',
    email: 'srini@example.com',
    role: 'dba'
  },
  {
    id: 'user-3',
    username: 'ops.team',
    email: 'ops@example.com',
    role: 'operator'
  }
];

// Simple in-memory session store (replace with Redis in production)
const sessions = new Map();

/**
 * Login endpoint
 * POST /api/auth/login
 */
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'username and password are required'
      });
    }

    // Simple password check (in production, use bcrypt)
    if (password !== 'demo-password') {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Create session
    const sessionId = uuidv4();
    const token = Buffer.from(`${sessionId}:${user.id}`).toString('base64');

    sessions.set(sessionId, {
      userId: user.id,
      username: user.username,
      createdAt: new Date(),
      lastActivity: new Date()
    });

    res.json({
      success: true,
      data: {
        sessionId,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        expiresIn: 3600
      },
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Verify token
 * GET /api/auth/verify
 */
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    try {
      const decoded = Buffer.from(token, 'base64').toString().split(':');
      const sessionId = decoded[0];
      const userId = decoded[1];

      const session = sessions.get(sessionId);
      if (!session) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired token'
        });
      }

      // Check session expiry (24 hours)
      const now = new Date();
      const sessionAge = now - session.createdAt;
      if (sessionAge > 24 * 60 * 60 * 1000) {
        sessions.delete(sessionId);
        return res.status(401).json({
          success: false,
          error: 'Session expired'
        });
      }

      // Update last activity
      session.lastActivity = now;

      const user = users.find(u => u.id === userId);
      res.json({
        success: true,
        data: {
          sessionId,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          },
          valid: true
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Logout
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const decoded = Buffer.from(token, 'base64').toString().split(':');
        const sessionId = decoded[0];
        sessions.delete(sessionId);
      } catch (e) {
        // Token decode error, continue
      }
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Refresh token
 * POST /api/auth/refresh
 */
router.post('/refresh', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    try {
      const decoded = Buffer.from(token, 'base64').toString().split(':');
      const sessionId = decoded[0];
      const userId = decoded[1];

      const session = sessions.get(sessionId);
      if (!session) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired token'
        });
      }

      // Create new session
      const newSessionId = uuidv4();
      const newToken = Buffer.from(`${newSessionId}:${userId}`).toString('base64');

      sessions.set(newSessionId, {
        userId,
        username: session.username,
        createdAt: new Date(),
        lastActivity: new Date()
      });

      // Delete old session
      sessions.delete(sessionId);

      const user = users.find(u => u.id === userId);
      res.json({
        success: true,
        data: {
          sessionId: newSessionId,
          token: newToken,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          },
          expiresIn: 3600
        },
        message: 'Token refreshed'
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get current user
 * GET /api/auth/me
 */
router.get('/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    try {
      const decoded = Buffer.from(token, 'base64').toString().split(':');
      const userId = decoded[1];

      const user = users.find(u => u.id === userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
