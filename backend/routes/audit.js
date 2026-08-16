const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory audit log
let auditLog = [
  {
    id: 'audit-1',
    timestamp: '2026-08-16 15:45:12',
    user: 'abhay.admin',
    action: 'Login',
    resource: 'prod-db-01',
    result: 'Success',
    ip: '192.168.1.100',
    createdAt: new Date().toISOString()
  },
  {
    id: 'audit-2',
    timestamp: '2026-08-16 15:30:22',
    user: 'srini.dba',
    action: 'Modify',
    resource: 'ProductionDB',
    result: 'Success',
    ip: '192.168.1.101',
    createdAt: new Date().toISOString()
  },
  {
    id: 'audit-3',
    timestamp: '2026-08-16 15:15:45',
    user: 'unknown.user',
    action: 'Login',
    resource: 'prod-db-01',
    result: 'Denied',
    ip: '192.168.0.50',
    createdAt: new Date().toISOString()
  }
];

// Get all audit logs
router.get('/logs', (req, res) => {
  try {
    const { user, action, resource, result, limit } = req.query;
    let filtered = [...auditLog];

    if (user) {
      filtered = filtered.filter(log => log.user.includes(user));
    }
    if (action) {
      filtered = filtered.filter(log => log.action === action);
    }
    if (resource) {
      filtered = filtered.filter(log => log.resource.includes(resource));
    }
    if (result) {
      filtered = filtered.filter(log => log.result === result);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Apply limit (default 100)
    const pageLimit = parseInt(limit) || 100;
    filtered = filtered.slice(0, pageLimit);

    res.json({
      success: true,
      data: filtered,
      count: filtered.length,
      total: auditLog.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single audit entry
router.get('/:id', (req, res) => {
  try {
    const log = auditLog.find(l => l.id === req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, error: 'Audit log not found' });
    }
    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create audit entry
router.post('/logs', (req, res) => {
  try {
    const { user, action, resource, result, ip } = req.body;

    if (!user || !action || !resource) {
      return res.status(400).json({
        success: false,
        error: 'user, action, and resource are required'
      });
    }

    const newLog = {
      id: `audit-${uuidv4().split('-')[0]}`,
      timestamp: new Date().toLocaleString().replace(',', ''),
      user,
      action,
      resource,
      result: result || 'Unknown',
      ip: ip || 'unknown',
      createdAt: new Date().toISOString()
    };

    auditLog.push(newLog);

    // Keep only last 1000 entries
    if (auditLog.length > 1000) {
      auditLog = auditLog.slice(-1000);
    }

    res.status(201).json({
      success: true,
      data: newLog,
      message: 'Audit entry logged'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export audit logs
router.get('/export/json', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filtered = [...auditLog];

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(log => new Date(log.timestamp) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      filtered = filtered.filter(log => new Date(log.timestamp) <= end);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${new Date().toISOString()}.json"`);
    res.json({
      success: true,
      data: filtered,
      count: filtered.count,
      exportedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export audit logs as CSV
router.get('/export/csv', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filtered = [...auditLog];

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(log => new Date(log.timestamp) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      filtered = filtered.filter(log => new Date(log.timestamp) <= end);
    }

    // Generate CSV
    const headers = ['ID', 'Timestamp', 'User', 'Action', 'Resource', 'Result', 'IP'];
    const rows = filtered.map(log => [
      log.id,
      log.timestamp,
      log.user,
      log.action,
      log.resource,
      log.result,
      log.ip
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(col => `"${col}"`).join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${new Date().toISOString()}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get audit statistics
router.get('/stats/summary', (req, res) => {
  try {
    const stats = {
      total: auditLog.length,
      success: auditLog.filter(l => l.result === 'Success').length,
      failed: auditLog.filter(l => l.result === 'Denied' || l.result === 'Failed').length,
      users: new Set(auditLog.map(l => l.user)).size,
      actions: new Set(auditLog.map(l => l.action)).size,
      resources: new Set(auditLog.map(l => l.resource)).size
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
