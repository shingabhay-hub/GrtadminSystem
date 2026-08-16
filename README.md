# GRT SysAdmin Operations Console

A comprehensive cyberpunk-themed operations management system for enterprise infrastructure, database operations, disaster recovery, and security monitoring.

## 🚀 Features

### Core Modules

#### 1. **Architecture Dashboard**
- Expandable domain trees covering 8 infrastructure domains
- Windows, Network, Identity, Application, Virtualization, Database, Cloud, Operations
- Quick reference for all system components and subdomains

#### 2. **Process Flows**
- 7 automated workflow diagrams:
  - Server Provisioning (14 steps)
  - Identity Onboarding (10 steps)
  - Application Deployment (8 steps)
  - Web Request Path (10 steps)
  - Change Management (8 steps)
  - Disk Full Triage (9 steps)
  - Scheduled Task Failure (9 steps)

#### 3. **DBA Operations** ⭐
- **Database Inventory**: Manage multiple database instances with RTO/RPO targets
- **Backup Scheduling**: Full, differential, transaction log, and snapshot backups
- **Active Query Monitoring**: Monitor running queries, detect blocking sessions
- **Data Mirroring Status**: Track replication lag and mirror synchronization
- **Add/Remove Databases**: Dynamic database management interface

#### 4. **Disaster Recovery** ⭐
- **RTO/RPO Targets**: Define recovery objectives for each system
- **Recovery Point History**: Track all backup and recovery events
- **Failover/Failback Plans**: Pre-planned failover procedures with test capabilities
- **DR Procedures**: Step-by-step recovery procedures for critical systems
- **Point-in-Time Recovery**: Restore from historical recovery points

#### 5. **Live Monitoring** ⭐
- **System Health Dashboard**: Real-time metrics:
  - Database Health %
  - Replication Lag (seconds)
  - Backup Success Rate %
  - Storage Utilization %
  - Active Connections
  - Query Wait Time (ms)
- **Active Alerts**: Real-time alert system with severity levels
- **User Access Audit Log**: Complete audit trail of all system access
- **Storage & Disk Pairing**: Monitor SAN array synchronization and capacity

#### 6. **Daily Checklist**
- Morning, During Day, and End of Day checklists
- Progress tracking with visual progress bars
- 30+ pre-defined checklist items
- Reset functionality for new days

#### 7. **Severity Matrix**
- SEV1-SEV8 classification system
- SLA definitions and color-coded badges
- Quick reference for incident severity

#### 8. **Attachments Manager**
- Drag-and-drop file upload
- Support for text files, JSON, logs, CSVs
- File preview capability
- In-memory storage (session-based)

#### 9. **Access & Keys Management**
- API Keys and Credentials storage
- MFA Device registration and tracking
- Expiry tracking for keys
- Device type categorization (Security Key, Authenticator, SMS, etc.)

---

## 📋 DBA Operations Features

### Database Management
```
✓ Add/remove database instances
✓ Define RTO (Recovery Time Objective)
✓ Define RPO (Recovery Point Objective)
✓ Track database size and type
✓ Status indicators (Healthy/Check)
```

### Backup Operations
```
✓ Full backups
✓ Differential backups
✓ Transaction log backups
✓ Snapshot backups
✓ Schedule management (Daily, Weekly, Hourly, On-Demand)
✓ Multiple destinations (Local, S3, Cloud)
✓ Last run tracking
```

### Query Management
```
✓ Active query monitoring
✓ Blocking session detection
✓ Query duration tracking
✓ Query kill capability
✓ Blocker identification
```

### Data Mirroring
```
✓ Primary/Secondary tracking
✓ Synchronization status
✓ Last sync timestamp
✓ Lag detection
```

---

## 🔄 Disaster Recovery Features

### Recovery Planning
```
✓ RTO/RPO definitions per system
✓ Multi-system DR procedures
✓ Automatic failover procedures
✓ Manual validation steps
✓ DNS failover + load balancer repoint
✓ DFSR replication support
```

### Recovery Point Management
```
✓ Full backup recovery points
✓ Transaction log recovery points
✓ Point-in-time recovery capability
✓ Recovery status tracking
✓ Test restore validation
```

### Failover Management
```
✓ Primary/Secondary site mapping
✓ Failover procedure documentation
✓ Failover status tracking
✓ Last DR test timestamp
✓ Failover simulation capability
```

---

## 📊 Live Monitoring Features

### System Health
```
✓ Database health percentage
✓ Replication lag monitoring
✓ Backup success rate
✓ Storage utilization
✓ Connection pool status
✓ Query performance metrics
✓ Auto-refresh (5-second interval)
```

### Alert Management
```
✓ Critical alerts (red)
✓ Warning alerts (yellow)
✓ Information alerts (blue)
✓ Alert timestamp tracking
✓ Alert severity categorization
✓ Real-time alert feed
```

### Security & Auditing
```
✓ User access logging
✓ Action tracking (Login, Logout, View, Modify, Delete, Export)
✓ Resource-level audit trail
✓ Success/Failure/Denied tracking
✓ Timestamp precision
✓ Up to 100 recent audit entries
```

### Storage Management
```
✓ SAN array monitoring
✓ Primary/Secondary capacity tracking
✓ Synchronization status
✓ Last sync timestamp
✓ Disk pairing visualization
```

---

## 🎨 UI/UX Features

- **Cyberpunk Theme**: Dark mode with neon blue/orange accents
- **Responsive Design**: Works on desktop and tablet
- **Smooth Animations**: 0.15s transitions for interactivity
- **Monospace Fonts**: Technical fonts (Share Tech Mono, Orbitron, Rajdhani)
- **Real-time Clock**: Shows current time in 24-hour format
- **Tab Navigation**: Easy switching between 9 different views
- **Toast Notifications**: Non-intrusive feedback messages
- **Modals**: For adding new items (databases, backups, keys, devices, access logs)
- **Progress Bars**: Visual completion tracking for checklists

---

## 📈 Testing & Validation Procedures

### 1. **Functionality Testing**

#### DBA Operations Tab
```bash
✓ Click "Add Database" button
✓ Fill in database details (name, server, type, RTO, RPO)
✓ Verify database appears in list
✓ Click "Remove" to delete database
✓ Verify queries display in Active Queries table
✓ Click "Kill" button on a query
✓ Add backup jobs and verify schedule/destination
✓ Verify mirroring status displays correctly
```

#### Disaster Recovery Tab
```bash
✓ Verify DR procedures show RTO/RPO targets
✓ Check recovery point history displays all backups
✓ Click "Restore" to simulate point-in-time recovery
✓ Add failover plan via modal
✓ Click "Test Failover" to simulate DR drill
✓ Verify failover status updates
```

#### Monitoring Tab
```bash
✓ Verify health metrics display with correct units
✓ Confirm metrics auto-refresh every 5 seconds
✓ Check all active alerts display with correct severity
✓ Add access log entry via modal
✓ Verify new entry appears in audit log (most recent first)
✓ Verify storage array sync status displays
```

#### Other Tabs
```bash
✓ Architecture: Click domains to expand/collapse
✓ Process Flows: Verify all 7 workflows display
✓ Daily Checklist: Check items, verify progress bar updates, reset
✓ Severity Matrix: Verify all SEV1-8 definitions display
✓ Attachments: Drag-drop file, verify size/name, remove file
✓ Access & Keys: Add API key/device, verify display, remove
```

### 2. **Data Persistence Testing**

```bash
⚠️  Note: Current version uses in-memory storage
   Data is lost on page refresh (by design)

To add localStorage persistence:
1. Modify state initialization to load from localStorage
2. Save state to localStorage on every modification
3. Test: Add item → Refresh page → Item persists
```

### 3. **Performance Testing**

```bash
✓ Monitor tab auto-refresh: Check CPU usage remains low
✓ Add 50+ items to checklist: Verify rendering performance
✓ Upload large file (5MB): Verify UI remains responsive
✓ Open multiple modals: Verify no lag or visual glitches
✓ Rapid tab switching: Verify smooth transitions
```

### 4. **Security Testing**

```bash
✓ XSS Prevention: Add <script> tag in text fields → Should escape
✓ Access Control: Verify audit log captures all actions
✓ Data Masking: Verify API keys show only partial value (*)
✓ Input Validation: Empty fields show error toast
✓ Modal Close: Escape key and Cancel button work
```

### 5. **Responsive Testing**

```bash
Test on:
- Desktop (1920x1080, 1366x768)
- Tablet (iPad 768x1024, Surface 1024x768)
- Mobile (Not fully optimized - for reference only)

Verify:
✓ Tabs remain accessible
✓ Tables scroll horizontally if needed
✓ Modals center properly
✓ Font sizes remain readable
✓ Buttons are clickable on touch devices
```

### 6. **Browser Compatibility**

```bash
✓ Chrome/Edge 90+
✓ Firefox 88+
✓ Safari 14+
✓ All modern ES6+ features
```

### 7. **Real-World Scenario Testing**

#### Scenario 1: Database Failure & Recovery
```bash
1. Create database entry in DBA Operations
2. Add corresponding backup job
3. Go to Disaster Recovery tab
4. Add recovery point for that database
5. Click "Restore" to simulate recovery
6. Verify audit log captures the restore action
7. Check monitoring tab for alert trigger
```

#### Scenario 2: Multi-Site Failover
```bash
1. Add failover plan (Primary DC → Secondary DC)
2. Create alert in monitoring
3. Click "Test Failover"
4. Log access event: "Failover initiated"
5. Verify failover status shows "Active"
6. Review full audit trail for all actions
```

#### Scenario 3: Daily Operations
```bash
1. Start with Morning Checklist
2. Add database, backup job, access log entry
3. Move to Monitoring tab - observe live metrics
4. Switch to DBA Operations - verify all items added
5. Go to Daily Checklist - mark items complete
6. End Day - verify progress saved
7. Attach operations log file
8. Reset checklist for next day
```

---

## 🛠️ Installation & Deployment

### Local Testing
```bash
# Simply open in browser
open index.html

# Or use local server
python3 -m http.server 8000
# Visit: http://localhost:8000
```

### GitHub Pages Deployment
```bash
# 1. Push to GitHub repo
git add .
git commit -m "Production release"
git push origin main

# 2. Enable GitHub Pages in repo settings
#    → Settings → Pages → Main branch
#    → Live at https://shingabhay-hub.github.io/GrtadminSystem/

# 3. Access: https://shingabhay-hub.github.io/GrtadminSystem/
```

### Docker Deployment
```bash
# Dockerfile
FROM nginx:latest
COPY index.html /usr/share/nginx/html/
EXPOSE 80

# Build and run
docker build -t grt-admin-console .
docker run -p 8080:80 grt-admin-console
```

---

## 📝 Data Format Examples

### Database Configuration
```json
{
  "name": "ProductionDB",
  "server": "sql-prod-01.internal",
  "type": "SQL Server",
  "rto": 15,
  "rpo": 5,
  "status": "ok",
  "size": "245 GB"
}
```

### Backup Job
```json
{
  "db": "ProductionDB",
  "type": "Full",
  "schedule": "Daily",
  "time": "02:00 AM",
  "destination": "S3://backups/prod",
  "lastRun": "2026-08-16 02:15 AM",
  "status": "ok"
}
```

### Failover Plan
```json
{
  "system": "Production DB Cluster",
  "primary": "DataCenter-A",
  "secondary": "DataCenter-B",
  "status": "Standby",
  "lastTest": "2026-08-01"
}
```

### Audit Log Entry
```json
{
  "timestamp": "2026-08-16 15:45:12",
  "user": "abhay.admin",
  "action": "Login",
  "resource": "prod-db-01",
  "result": "Success"
}
```

---

## 🔐 Security Considerations

### Current Implementation
- All data stored in memory (session-only)
- No external API calls or network requests
- Client-side only operation
- No authentication required (intended for internal LAN)

### For Production Deployment
1. **Add Authentication**: OAuth 2.0 / SSO integration
2. **Add HTTPS**: SSL/TLS encryption for HTTPS
3. **Add Backend**: REST API for persistent storage
4. **Add Database**: PostgreSQL/MySQL for audit logs
5. **Add RBAC**: Role-based access control
6. **Add Encryption**: Encrypt sensitive data (API keys, credentials)
7. **Add Logging**: Centralized logging (ELK, Splunk)
8. **Add 2FA**: Two-factor authentication for admin accounts

---

## 📊 Default Sample Data

### Pre-loaded Databases
- ProductionDB (SQL Server, RTO: 15m, RPO: 5m)
- ReportingDB (SQL Server, RTO: 60m, RPO: 30m)

### Pre-loaded Backup Jobs
- ProductionDB Full Backup (Daily 02:00 AM)
- ProductionDB Transaction Log (Hourly)

### Pre-loaded Failover Plans
- Production DB Cluster (DC-A ↔ DC-B)

### Pre-loaded Alerts
- High CPU on SQL-PROD-01
- Backup Delayed
- Replication Lag Detected
- Disk Space Alert

### Pre-loaded Health Metrics
- Database Health: 98%
- Replication Lag: 0.8 seconds
- Backup Success: 100%
- Storage Used: 67%

---

## 🚦 Quick Start Guide

### For First-Time Users

1. **Open the Console**
   - Open `index.html` in modern browser
   - See animated header and architecture overview

2. **Explore Architecture**
   - Click on domain boxes to expand (Windows, Network, Database, etc.)
   - See 8 infrastructure domains with sub-items

3. **Review Workflows**
   - Click "Process Flows" tab
   - See 7 standard operational workflows
   - Understand server provisioning, onboarding, deployment patterns

4. **DBA Operations**
   - Click "DBA Operations" tab
   - View sample databases and backup jobs
   - Click "Add Database" to register new instance
   - Add backup job for disaster recovery

5. **Disaster Recovery**
   - Click "Disaster Recovery" tab
   - Review RTO/RPO targets for each system
   - Check recovery point history
   - Add/test failover plans

6. **Live Monitoring**
   - Click "Live Monitoring" tab
   - Watch health metrics update in real-time (every 5 seconds)
   - Check active alerts
   - Review user access audit log
   - Monitor storage synchronization

7. **Daily Operations**
   - Use "Daily Checklist" tab for morning/day/end-of-day tasks
   - Mark items as completed
   - See progress automatically calculated

8. **Manage Credentials**
   - Click "Access & Keys" tab
   - Add API keys with expiry tracking
   - Register MFA devices
   - Manage security credentials

---

## 📞 Support & Maintenance

### Common Issues & Solutions

**Issue**: Data disappears after refresh
**Solution**: This is by design (in-memory storage). Add localStorage for persistence.

**Issue**: Metrics not updating
**Solution**: Check browser console. Verify JavaScript enabled. Wait 5 seconds for auto-refresh.

**Issue**: File upload not working
**Solution**: Check file size < 4MB. Use text-based files for preview. Check browser permissions.

**Issue**: Modals not closing
**Solution**: Press Escape key or click Cancel. Check browser console for errors.

---

## 📜 License

Created for GRT Infrastructure & Operations Team

---

## 👤 Author

Abhay / GRT Assist Automations & Security

---

## 🎯 Future Enhancements

- [ ] localStorage persistence
- [ ] Export to PDF reports
- [ ] Dark/Light theme toggle
- [ ] Real-time monitoring integration
- [ ] Email alert notifications
- [ ] Slack/Teams integration
- [ ] API backend connection
- [ ] Database schema visualization
- [ ] Network topology diagram
- [ ] Real-time log streaming
- [ ] Automated backup verification
- [ ] Cost analysis dashboard
- [ ] Capacity planning tools
- [ ] Change calendar
- [ ] Incident post-mortem templates

---

Last Updated: August 16, 2026
Version: 1.0 - Production Ready