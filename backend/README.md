# GRT SysAdmin Operations Console - Backend API

Complete REST API for the GRT SysAdmin Operations Console with support for database management, backup operations, monitoring, alerting, audit logging, and security management.

## Features

- 🗄️ **Database Management** - CRUD operations for databases with health checks
- 💾 **Backup Operations** - Schedule and manage backup jobs with history tracking
- 📊 **Live Monitoring** - Real-time metrics, health status, and performance data
- 🚨 **Alert Management** - Create, acknowledge, and resolve alerts with severity levels
- 📋 **Audit Logging** - Comprehensive audit trail with export capabilities (JSON/CSV)
- 🔐 **Credential Management** - Secure key/secret storage with masking and rotation
- 🔑 **Device Management** - Register and track security devices and authenticators
- 🔐 **Authentication** - Session-based auth with token verification

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/shingabhay-hub/GrtadminSystem.git
cd GrtadminSystem/backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start the server
npm start
```

The API will be available at `http://localhost:5000`

### Development

```bash
# Install dev dependencies
npm install

# Start with auto-reload (requires nodemon)
npm run dev

# Run tests
npm test
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /api/health
```

Returns server status and version information.

### Databases

#### List Databases
```
GET /api/databases
```

#### Get Database
```
GET /api/databases/:id
```

#### Create Database
```
POST /api/databases
Content-Type: application/json

{
  "name": "ProductionDB",
  "server": "sql-prod-01.internal",
  "type": "SQL Server",
  "rto": 15,
  "rpo": 5
}
```

#### Update Database
```
PUT /api/databases/:id
Content-Type: application/json

{
  "name": "ProductionDB-Updated",
  "status": "ok"
}
```

#### Delete Database
```
DELETE /api/databases/:id
```

#### Get Database Health
```
GET /api/databases/:id/health
```

### Backups

#### List Backup Jobs
```
GET /api/backups
```

#### Create Backup Job
```
POST /api/backups
Content-Type: application/json

{
  "db": "ProductionDB",
  "type": "Full",
  "schedule": "Daily",
  "destination": "s3://backups/prod"
}
```

#### Run Backup
```
POST /api/backups/:id/run
```

#### Get Backup History
```
GET /api/backups/:id/history
```

### Monitoring

#### Get Current Metrics
```
GET /api/monitoring/metrics
```

Returns CPU, memory, disk, network usage and system metrics.

#### Get System Health
```
GET /api/monitoring/health
```

Returns health status of all systems and components.

#### Get Monitoring Timeline
```
GET /api/monitoring/timeline?hours=24
```

Returns historical metrics for specified period.

#### Get Database Metrics
```
GET /api/monitoring/databases
```

Returns database-specific performance metrics.

#### Get Storage Metrics
```
GET /api/monitoring/storage
```

Returns storage array usage and sync status.

#### Get Replication Status
```
GET /api/monitoring/replication
```

Returns database replication and mirror status.

### Alerts

#### List Alerts
```
GET /api/alerts?severity=critical&status=active
```

Query parameters:
- `severity`: critical, warn, info
- `status`: active, acknowledged, resolved

#### Create Alert
```
POST /api/alerts
Content-Type: application/json

{
  "title": "High CPU Alert",
  "msg": "CPU usage exceeds 85%",
  "severity": "warn"
}
```

#### Acknowledge Alert
```
PUT /api/alerts/:id/acknowledge
Content-Type: application/json

{
  "user": "abhay.admin"
}
```

#### Resolve Alert
```
PUT /api/alerts/:id/resolve
Content-Type: application/json

{
  "user": "abhay.admin",
  "resolution": "Scaled database cluster"
}
```

#### Get Alert Statistics
```
GET /api/alerts/stats/summary
```

### Audit Logs

#### List Audit Logs
```
GET /api/audit/logs?limit=100&user=abhay.admin
```

Query parameters:
- `user`: Filter by username
- `action`: Filter by action type
- `resource`: Filter by resource
- `result`: Filter by result (Success/Denied/Failed)
- `limit`: Max results (default 100)

#### Create Audit Entry
```
POST /api/audit/logs
Content-Type: application/json

{
  "user": "abhay.admin",
  "action": "Login",
  "resource": "prod-db-01",
  "result": "Success",
  "ip": "192.168.1.100"
}
```

#### Export Audit Logs (JSON)
```
GET /api/audit/export/json?startDate=2026-08-01&endDate=2026-08-31
```

#### Export Audit Logs (CSV)
```
GET /api/audit/export/csv?startDate=2026-08-01&endDate=2026-08-31
```

#### Get Audit Statistics
```
GET /api/audit/stats/summary
```

### Keys & Credentials

#### List Keys (Masked)
```
GET /api/keys
```

Note: Key values are automatically masked for security.

#### Create Key
```
POST /api/keys
Content-Type: application/json

{
  "name": "Azure Storage Key",
  "value": "DefaultEndpointsProtocol=https;...",
  "type": "connection-string",
  "expiry": "2026-12-31"
}
```

#### Rotate Key
```
POST /api/keys/:id/rotate
Content-Type: application/json

{
  "newValue": "new-secret-value-here"
}
```

#### Check Key Expiry
```
GET /api/keys/:id/expiry
```

### Devices

#### List Devices
```
GET /api/devices?owner=Abhay&type=Security%20Key
```

#### Register Device
```
POST /api/devices
Content-Type: application/json

{
  "name": "YubiKey 5C",
  "type": "Security Key",
  "owner": "Abhay"
}
```

#### Log Device Usage
```
POST /api/devices/:id/use
```

#### Get Device Status
```
GET /api/devices/:id/status
```

#### Get Device Audit Trail
```
GET /api/devices/:id/audit
```

### Authentication

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "abhay.admin",
  "password": "demo-password"
}
```

#### Verify Token
```
GET /api/auth/verify
Authorization: Bearer <token>
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

#### Refresh Token
```
POST /api/auth/refresh
Authorization: Bearer <token>
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>
```

## Response Format

All endpoints return a consistent JSON response format:

### Success Response
```json
{
  "success": true,
  "data": {
    /* Response data */
  },
  "message": "Operation completed successfully",
  "timestamp": "2026-08-16T15:45:30.123Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "status": 400,
  "timestamp": "2026-08-16T15:45:30.123Z"
}
```

## Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:
- `NODE_ENV`: development, production
- `PORT`: Server port (default 5000)
- `CORS_ORIGIN`: Allowed CORS origins
- `LOG_LEVEL`: Logging level

## Production Deployment

### Docker
```bash
docker build -t grt-admin-api .
docker run -p 5000:5000 --env-file .env grt-admin-api
```

### PM2
```bash
npm install -g pm2
pm2 start server.js --name "grt-admin-api"
pm2 save
pm2 startup
```

### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Security Considerations

- 🔐 Use HTTPS in production
- 🔑 Keep JWT secrets secure
- 🛡️ Implement rate limiting
- 🔏 Use encrypted connections to databases
- 📋 Enable audit logging for compliance
- 🚨 Monitor and alert on suspicious activities
- 🔑 Rotate credentials regularly
- 👥 Implement role-based access control (RBAC)

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Monitoring

The API includes built-in monitoring endpoints for:
- System health checks
- Performance metrics
- Database replication status
- Backup job history
- Alert statistics
- Audit trail

Access monitoring data via `/api/monitoring/*` endpoints.

## Troubleshooting

### Port already in use
```bash
# Change port in .env
PORT=5001
npm start
```

### CORS errors
```bash
# Update CORS_ORIGIN in .env
CORS_ORIGIN=http://localhost:3000,https://example.com
```

### Database connection issues
```bash
# Check database credentials in .env
# Verify database is running and accessible
```

## Architecture

```
backend/
├── server.js              # Main Express server
├── routes/
│   ├── databases.js       # Database CRUD + health
│   ├── backups.js         # Backup job management
│   ├── monitoring.js      # Metrics and health checks
│   ├── alerts.js          # Alert management
│   ├── audit.js           # Audit logging
│   ├── keys.js            # Credential management
│   ├── devices.js         # Device tracking
│   └── auth.js            # Authentication & sessions
├── package.json
├── .env.example
└── README.md
```

## API Changelog

### Version 1.0.0 (Current)
- Initial release with core endpoints
- Database management
- Backup operations
- Real-time monitoring
- Alert management
- Audit logging
- Credential management
- Device tracking
- Authentication

## Contributing

Pull requests welcome! Please follow the existing code style and add tests for new features.

## Support

For issues and questions, please open an issue on GitHub.

## License

MIT License - See LICENSE file for details

## Author

Abhay Shingabhay  
GRT SysAdmin Operations Console Project

---

**API Documentation**: `/api/docs`  
**Health Check**: `/api/health`  
**Live at**: https://shingabhay-hub.github.io/GrtadminSystem/
