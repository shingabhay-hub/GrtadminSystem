const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage (replace with database in production)
let databases = [
  {
    id: 'db-1',
    name: 'ProductionDB',
    server: 'sql-prod-01.internal',
    type: 'SQL Server',
    rto: 15,
    rpo: 5,
    status: 'ok',
    size: '245 GB',
    createdAt: new Date().toISOString()
  },
  {
    id: 'db-2',
    name: 'ReportingDB',
    server: 'sql-prod-02.internal',
    type: 'SQL Server',
    rto: 60,
    rpo: 30,
    status: 'ok',
    size: '89 GB',
    createdAt: new Date().toISOString()
  }
];

// List all databases
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: databases,
      count: databases.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single database
router.get('/:id', (req, res) => {
  try {
    const db = databases.find(d => d.id === req.params.id);
    if (!db) {
      return res.status(404).json({ success: false, error: 'Database not found' });
    }
    res.json({ success: true, data: db });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new database
router.post('/', (req, res) => {
  try {
    const { name, server, type, rto, rpo } = req.body;

    if (!name || !server) {
      return res.status(400).json({
        success: false,
        error: 'name and server are required'
      });
    }

    const newDb = {
      id: `db-${uuidv4().split('-')[0]}`,
      name,
      server,
      type: type || 'SQL Server',
      rto: rto || 15,
      rpo: rpo || 5,
      status: 'ok',
      size: '0 GB',
      createdAt: new Date().toISOString()
    };

    databases.push(newDb);
    res.status(201).json({
      success: true,
      data: newDb,
      message: 'Database created successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update database
router.put('/:id', (req, res) => {
  try {
    const db = databases.find(d => d.id === req.params.id);
    if (!db) {
      return res.status(404).json({ success: false, error: 'Database not found' });
    }

    Object.assign(db, req.body, { id: db.id, createdAt: db.createdAt });
    db.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: db,
      message: 'Database updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete database
router.delete('/:id', (req, res) => {
  try {
    const index = databases.findIndex(d => d.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Database not found' });
    }

    const deleted = databases.splice(index, 1)[0];
    res.json({
      success: true,
      data: deleted,
      message: 'Database deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get database health
router.get('/:id/health', (req, res) => {
  try {
    const db = databases.find(d => d.id === req.params.id);
    if (!db) {
      return res.status(404).json({ success: false, error: 'Database not found' });
    }

    res.json({
      success: true,
      data: {
        id: db.id,
        name: db.name,
        status: db.status,
        health: {
          cpu: Math.floor(Math.random() * 100),
          memory: Math.floor(Math.random() * 100),
          disk: Math.floor(Math.random() * 100),
          connections: Math.floor(Math.random() * 1000),
          replicationLag: (Math.random() * 5).toFixed(2)
        },
        lastCheck: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
