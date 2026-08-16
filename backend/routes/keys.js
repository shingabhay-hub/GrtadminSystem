const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory keys (Note: In production, use encrypted vault)
let keys = [
  {
    id: 'key-1',
    name: 'Azure Storage Connection',
    value: 'DefaultEndpointsProtocol=https;...',
    type: 'connection-string',
    expiry: '2026-10-15',
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString()
  },
  {
    id: 'key-2',
    name: 'SMTP Relay Secret',
    value: 'smtp-secret-key-***',
    type: 'api-key',
    expiry: '',
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString()
  }
];

// List all keys (masked)
router.get('/', (req, res) => {
  try {
    const masked = keys.map(key => ({
      ...key,
      value: `${key.value.substring(0, 4)}${'*'.repeat(Math.max(0, key.value.length - 8))}${key.value.substring(key.value.length - 4)}`
    }));

    res.json({
      success: true,
      data: masked,
      count: masked.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single key metadata (masked)
router.get('/:id', (req, res) => {
  try {
    const key = keys.find(k => k.id === req.params.id);
    if (!key) {
      return res.status(404).json({ success: false, error: 'Key not found' });
    }

    const masked = {
      ...key,
      value: `${key.value.substring(0, 4)}${'*'.repeat(Math.max(0, key.value.length - 8))}${key.value.substring(key.value.length - 4)}`
    };

    res.json({ success: true, data: masked });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new key
router.post('/', (req, res) => {
  try {
    const { name, value, type, expiry } = req.body;

    if (!name || !value) {
      return res.status(400).json({
        success: false,
        error: 'name and value are required'
      });
    }

    const newKey = {
      id: `key-${uuidv4().split('-')[0]}`,
      name,
      value,
      type: type || 'api-key',
      expiry: expiry || '',
      createdAt: new Date().toISOString(),
      lastUsed: null
    };

    keys.push(newKey);

    const masked = {
      ...newKey,
      value: `${value.substring(0, 4)}${'*'.repeat(Math.max(0, value.length - 8))}${value.substring(value.length - 4)}`
    };

    res.status(201).json({
      success: true,
      data: masked,
      message: 'Key created successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update key metadata
router.put('/:id', (req, res) => {
  try {
    const key = keys.find(k => k.id === req.params.id);
    if (!key) {
      return res.status(404).json({ success: false, error: 'Key not found' });
    }

    // Only allow updating metadata, not the value itself
    if (req.body.name) key.name = req.body.name;
    if (req.body.type) key.type = req.body.type;
    if (req.body.expiry) key.expiry = req.body.expiry;
    key.updatedAt = new Date().toISOString();

    const masked = {
      ...key,
      value: `${key.value.substring(0, 4)}${'*'.repeat(Math.max(0, key.value.length - 8))}${key.value.substring(key.value.length - 4)}`
    };

    res.json({
      success: true,
      data: masked,
      message: 'Key updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rotate key (create new version)
router.post('/:id/rotate', (req, res) => {
  try {
    const key = keys.find(k => k.id === req.params.id);
    if (!key) {
      return res.status(404).json({ success: false, error: 'Key not found' });
    }

    const { newValue } = req.body;
    if (!newValue) {
      return res.status(400).json({
        success: false,
        error: 'newValue is required'
      });
    }

    // Store old version
    key.previousValue = key.value;
    key.previousUsedAt = key.lastUsed;
    key.value = newValue;
    key.rotatedAt = new Date().toISOString();
    key.updatedAt = new Date().toISOString();

    const masked = {
      ...key,
      value: `${newValue.substring(0, 4)}${'*'.repeat(Math.max(0, newValue.length - 8))}${newValue.substring(newValue.length - 4)}`
    };

    res.json({
      success: true,
      data: masked,
      message: 'Key rotated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete key
router.delete('/:id', (req, res) => {
  try {
    const index = keys.findIndex(k => k.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Key not found' });
    }

    const deleted = keys.splice(index, 1)[0];
    const masked = {
      ...deleted,
      value: 'DELETED'
    };

    res.json({
      success: true,
      data: masked,
      message: 'Key deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check key expiry
router.get('/:id/expiry', (req, res) => {
  try {
    const key = keys.find(k => k.id === req.params.id);
    if (!key) {
      return res.status(404).json({ success: false, error: 'Key not found' });
    }

    let status = 'active';
    let daysUntilExpiry = null;

    if (key.expiry) {
      const expiryDate = new Date(key.expiry);
      daysUntilExpiry = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry < 0) {
        status = 'expired';
      } else if (daysUntilExpiry < 30) {
        status = 'expiring-soon';
      }
    }

    res.json({
      success: true,
      data: {
        id: key.id,
        name: key.name,
        expiry: key.expiry,
        status,
        daysUntilExpiry
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
