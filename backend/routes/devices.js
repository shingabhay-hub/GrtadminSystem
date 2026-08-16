const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory devices
let devices = [
  {
    id: 'dev-1',
    name: 'YubiKey 5C',
    type: 'Security Key',
    owner: 'Abhay',
    status: 'ok',
    lastUsed: '2026-08-16 14:30:00',
    createdAt: new Date().toISOString()
  },
  {
    id: 'dev-2',
    name: 'iPhone Authenticator',
    type: 'Authenticator App',
    owner: 'Operations',
    status: 'warn',
    lastUsed: '2026-08-15 09:15:00',
    createdAt: new Date().toISOString()
  }
];

// List all devices
router.get('/', (req, res) => {
  try {
    const { owner, type, status } = req.query;
    let filtered = devices;

    if (owner) {
      filtered = filtered.filter(d => d.owner.includes(owner));
    }
    if (type) {
      filtered = filtered.filter(d => d.type === type);
    }
    if (status) {
      filtered = filtered.filter(d => d.status === status);
    }

    res.json({
      success: true,
      data: filtered,
      count: filtered.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single device
router.get('/:id', (req, res) => {
  try {
    const device = devices.find(d => d.id === req.params.id);
    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }
    res.json({ success: true, data: device });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Register new device
router.post('/', (req, res) => {
  try {
    const { name, type, owner } = req.body;

    if (!name || !owner) {
      return res.status(400).json({
        success: false,
        error: 'name and owner are required'
      });
    }

    const newDevice = {
      id: `dev-${uuidv4().split('-')[0]}`,
      name,
      type: type || 'Authenticator',
      owner,
      status: 'ok',
      lastUsed: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    devices.push(newDevice);
    res.status(201).json({
      success: true,
      data: newDevice,
      message: 'Device registered successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update device
router.put('/:id', (req, res) => {
  try {
    const device = devices.find(d => d.id === req.params.id);
    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }

    if (req.body.name) device.name = req.body.name;
    if (req.body.type) device.type = req.body.type;
    if (req.body.owner) device.owner = req.body.owner;
    if (req.body.status) device.status = req.body.status;
    device.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: device,
      message: 'Device updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove device
router.delete('/:id', (req, res) => {
  try {
    const index = devices.findIndex(d => d.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }

    const deleted = devices.splice(index, 1)[0];
    res.json({
      success: true,
      data: deleted,
      message: 'Device removed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update last used timestamp
router.post('/:id/use', (req, res) => {
  try {
    const device = devices.find(d => d.id === req.params.id);
    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }

    device.lastUsed = new Date().toISOString();
    device.usageCount = (device.usageCount || 0) + 1;

    res.json({
      success: true,
      data: device,
      message: 'Device usage logged'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check device status
router.get('/:id/status', (req, res) => {
  try {
    const device = devices.find(d => d.id === req.params.id);
    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }

    const now = new Date();
    const lastUsedDate = new Date(device.lastUsed);
    const hoursSinceUse = (now - lastUsedDate) / (1000 * 60 * 60);

    let healthStatus = 'healthy';
    if (hoursSinceUse > 24) {
      healthStatus = 'warning';
    }
    if (hoursSinceUse > 72) {
      healthStatus = 'alert';
    }

    res.json({
      success: true,
      data: {
        id: device.id,
        name: device.name,
        status: device.status,
        healthStatus,
        lastUsed: device.lastUsed,
        hoursSinceUse: hoursSinceUse.toFixed(1),
        usageCount: device.usageCount || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get device audit trail
router.get('/:id/audit', (req, res) => {
  try {
    const device = devices.find(d => d.id === req.params.id);
    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }

    // Return sample audit trail
    const auditTrail = [
      {
        timestamp: '2026-08-16 14:30:00',
        action: 'Used',
        resource: 'prod-db-01',
        result: 'success'
      },
      {
        timestamp: '2026-08-15 10:15:00',
        action: 'Used',
        resource: 'app-server-02',
        result: 'success'
      },
      {
        timestamp: '2026-08-14 16:45:00',
        action: 'Used',
        resource: 'prod-db-01',
        result: 'success'
      }
    ];

    res.json({
      success: true,
      data: {
        device: device.name,
        auditTrail,
        count: auditTrail.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
