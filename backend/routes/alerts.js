const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory alerts
let alerts = [
  {
    id: 'alert-1',
    title: 'High CPU on SQL-PROD-01',
    msg: 'CPU usage 87% for 10+ minutes',
    time: '15:42',
    severity: 'warn',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'alert-2',
    title: 'Backup Delayed',
    msg: 'ProductionDB full backup running 1h behind schedule',
    time: '15:35',
    severity: 'critical',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'alert-3',
    title: 'Replication Lag Detected',
    msg: 'ProductionDB-DR mirror lag: 45 seconds',
    time: '15:28',
    severity: 'warn',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'alert-4',
    title: 'Disk Space Alert',
    msg: 'SAN-01 array at 78% capacity',
    time: '15:20',
    severity: 'info',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

// List all alerts
router.get('/', (req, res) => {
  try {
    const { severity, status } = req.query;
    let filtered = alerts;

    if (severity) {
      filtered = filtered.filter(a => a.severity === severity);
    }
    if (status) {
      filtered = filtered.filter(a => a.status === status);
    }

    res.json({
      success: true,
      data: filtered,
      count: filtered.length,
      total: alerts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single alert
router.get('/:id', (req, res) => {
  try {
    const alert = alerts.find(a => a.id === req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new alert
router.post('/', (req, res) => {
  try {
    const { title, msg, severity } = req.body;

    if (!title || !msg) {
      return res.status(400).json({
        success: false,
        error: 'title and msg are required'
      });
    }

    const newAlert = {
      id: `alert-${uuidv4().split('-')[0]}`,
      title,
      msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      severity: severity || 'info',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    alerts.push(newAlert);
    res.status(201).json({
      success: true,
      data: newAlert,
      message: 'Alert created successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Acknowledge alert
router.put('/:id/acknowledge', (req, res) => {
  try {
    const alert = alerts.find(a => a.id === req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    alert.status = 'acknowledged';
    alert.acknowledgedAt = new Date().toISOString();
    alert.acknowledgedBy = req.body.user || 'system';

    res.json({
      success: true,
      data: alert,
      message: 'Alert acknowledged'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Resolve alert
router.put('/:id/resolve', (req, res) => {
  try {
    const alert = alerts.find(a => a.id === req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    alert.status = 'resolved';
    alert.resolvedAt = new Date().toISOString();
    alert.resolvedBy = req.body.user || 'system';
    alert.resolution = req.body.resolution || 'Resolved';

    res.json({
      success: true,
      data: alert,
      message: 'Alert resolved'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete alert
router.delete('/:id', (req, res) => {
  try {
    const index = alerts.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    const deleted = alerts.splice(index, 1)[0];
    res.json({
      success: true,
      data: deleted,
      message: 'Alert deleted'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get alert statistics
router.get('/stats/summary', (req, res) => {
  try {
    const stats = {
      total: alerts.length,
      active: alerts.filter(a => a.status === 'active').length,
      acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
      resolved: alerts.filter(a => a.status === 'resolved').length,
      critical: alerts.filter(a => a.severity === 'critical').length,
      warning: alerts.filter(a => a.severity === 'warn').length,
      info: alerts.filter(a => a.severity === 'info').length
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
