const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage
let backups = [
  {
    id: 'backup-1',
    db: 'ProductionDB',
    type: 'Full',
    schedule: 'Daily',
    time: '02:00 AM',
    destination: 's3://backups/prod',
    lastRun: '2026-08-16 02:15 AM',
    status: 'ok',
    createdAt: new Date().toISOString()
  },
  {
    id: 'backup-2',
    db: 'ProductionDB',
    type: 'Transaction Log',
    schedule: 'Hourly',
    time: 'Every hour',
    destination: '/backups/prod-tlog',
    lastRun: '2026-08-16 15:00 AM',
    status: 'ok',
    createdAt: new Date().toISOString()
  }
];

// List all backup jobs
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: backups,
      count: backups.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single backup job
router.get('/:id', (req, res) => {
  try {
    const backup = backups.find(b => b.id === req.params.id);
    if (!backup) {
      return res.status(404).json({ success: false, error: 'Backup job not found' });
    }
    res.json({ success: true, data: backup });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new backup job
router.post('/', (req, res) => {
  try {
    const { db, type, schedule, destination } = req.body;

    if (!db || !type || !destination) {
      return res.status(400).json({
        success: false,
        error: 'db, type, and destination are required'
      });
    }

    const newBackup = {
      id: `backup-${uuidv4().split('-')[0]}`,
      db,
      type,
      schedule: schedule || 'On Demand',
      time: 'Pending',
      destination,
      lastRun: 'Never',
      status: 'ok',
      createdAt: new Date().toISOString()
    };

    backups.push(newBackup);
    res.status(201).json({
      success: true,
      data: newBackup,
      message: 'Backup job created successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update backup job
router.put('/:id', (req, res) => {
  try {
    const backup = backups.find(b => b.id === req.params.id);
    if (!backup) {
      return res.status(404).json({ success: false, error: 'Backup job not found' });
    }

    Object.assign(backup, req.body, { id: backup.id, createdAt: backup.createdAt });
    backup.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: backup,
      message: 'Backup job updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete backup job
router.delete('/:id', (req, res) => {
  try {
    const index = backups.findIndex(b => b.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Backup job not found' });
    }

    const deleted = backups.splice(index, 1)[0];
    res.json({
      success: true,
      data: deleted,
      message: 'Backup job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Run backup immediately
router.post('/:id/run', (req, res) => {
  try {
    const backup = backups.find(b => b.id === req.params.id);
    if (!backup) {
      return res.status(404).json({ success: false, error: 'Backup job not found' });
    }

    backup.lastRun = new Date().toLocaleString();
    backup.status = 'ok';

    res.json({
      success: true,
      data: backup,
      message: `Backup ${backup.db} started successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get backup history
router.get('/:id/history', (req, res) => {
  try {
    const backup = backups.find(b => b.id === req.params.id);
    if (!backup) {
      return res.status(404).json({ success: false, error: 'Backup job not found' });
    }

    res.json({
      success: true,
      data: {
        id: backup.id,
        db: backup.db,
        type: backup.type,
        history: [
          { timestamp: '2026-08-16 02:15 AM', status: 'success', duration: '2h 34m', size: '245 GB' },
          { timestamp: '2026-08-15 02:10 AM', status: 'success', duration: '2h 28m', size: '243 GB' },
          { timestamp: '2026-08-14 02:05 AM', status: 'success', duration: '2h 31m', size: '242 GB' }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
