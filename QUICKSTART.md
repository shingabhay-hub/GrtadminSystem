# GRT SysAdmin Operations Console - Quick Start Guide

Get the console running in 5 minutes!

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Open in Browser
```bash
# Simply open the file
open index.html

# Or use a local server (if needed)
python3 -m http.server 8000
# Visit: http://localhost:8000
```

### Step 2: See Default Data
The console loads with sample data:
- **2 Databases**: ProductionDB, ReportingDB
- **2 Backup Jobs**: Full + Transaction Log backups  
- **3 Alerts**: CPU, Backup Delayed, Replication Lag
- **6 Health Metrics**: Auto-updating every 5 seconds
- **2 API Keys**: Sample credentials
- **2 MFA Devices**: YubiKey and Authenticator App

### Step 3: Try Each Tab (2 min)
```
1. Architecture → Click domains to expand
2. Process Flows → See 7 operational workflows
3. DBA Operations → View databases & backups
4. Disaster Recovery → Check RTO/RPO targets
5. Live Monitoring → Watch real-time metrics
6. Daily Checklist → Mark items complete
7. Severity Matrix → See SLA definitions
8. Attachments → Drag-drop files
9. Access & Keys → Manage credentials
```

### Step 4: Add Your First Item (1 min)
```
Example: Add a database
1. Go to DBA Operations tab
2. Click "+ Add Database"
3. Fill:
   - Name: MyDatabase
   - Server: db.example.com
   - Type: SQL Server
   - RTO: 20 (minutes)
   - RPO: 10 (minutes)
4. Click "Save Database"
5. See success toast notification
6. Database appears in list
```

### Step 5: Test Live Monitoring (1 min)
```
1. Go to Live Monitoring tab
2. Watch metrics update every 5 seconds
3. Observe:
   - Database Health %
   - Replication Lag (sec)
   - Backup Success %
4. View 4 active alerts
5. Review 3 audit log entries
```

---

## 🎯 Common First Tasks

### Task 1: Register Databases
```
DBA Operations tab → "+ Add Database"

Fill in:
✓ Database name (e.g., "Production-ERP")
✓ Server (e.g., "sql-prod-01.internal")
✓ Type (SQL Server, PostgreSQL, MySQL, Oracle, MongoDB)
✓ RTO - Recovery Time Objective in minutes
✓ RPO - Recovery Point Objective in minutes

Example values:
- Production: RTO 15min, RPO 5min
- Reporting: RTO 60min, RPO 30min
- Dev: RTO 480min, RPO 60min
```

### Task 2: Create Backup Schedule
```
DBA Operations tab → "+ Add Backup Job"

Fill in:
✓ Database name (from registered databases)
✓ Backup type:
  - Full (complete database backup)
  - Differential (changes since last full)
  - Transaction Log (for point-in-time recovery)
  - Snapshot (point-in-time copy)
✓ Schedule (Daily, Weekly, Hourly, On-Demand)
✓ Destination (local path or S3 bucket)

Example:
- ProductionDB Full backup daily @ 2:00 AM → S3://backups/prod
- ProductionDB Transaction Log hourly → /backups/prod-logs
```

### Task 3: Set Up Disaster Recovery
```
Disaster Recovery tab → "+ New Failover Entry"

Fill in:
✓ System Name (e.g., "Web App Cluster")
✓ Primary Site (e.g., "DataCenter-A")
✓ Secondary Site (e.g., "DataCenter-B")
✓ Failover Procedure (steps to execute)

Example procedure:
1. Validate secondary site connectivity
2. Stop writes to primary database
3. Promote secondary to primary
4. Update DNS entries
5. Test application connectivity
6. Monitor metrics for 1 hour
```

### Task 4: Track Access & Security
```
Live Monitoring tab → "+ Log Access Event"

Log each important action:
✓ Username (who)
✓ Action (Login, Modify, Delete, Export, etc.)
✓ Resource (what system/file)
✓ Result (Success, Failure, Denied)

Examples:
- User: admin.user, Action: Login, Resource: prod-db-01, Result: Success
- User: dba.team, Action: Modify, Resource: ProductionDB, Result: Success
- User: hacker.bot, Action: Login, Resource: prod-db-01, Result: Denied
```

### Task 5: Daily Operations Checklist
```
Daily Checklist tab

Complete in order:

Morning (30 min):
  ☑ Check monitoring dashboard
  ☑ Check critical alerts
  ☑ Check server availability
  ☑ Check CPU/RAM
  ☑ Check disk usage
  ☑ Check critical services
  ☑ Check backups completed
  ☑ Check SQL jobs
  ☑ Check certificates (expiry)
  ☑ Review overnight incidents

During Day (ongoing):
  ☑ Process tickets
  ☑ Handle user access requests
  ☑ Resolve application issues
  ☑ Handle network issues
  ☑ Execute planned changes
  ☑ Resolve database issues
  ☑ Review security alerts
  ☑ Document all changes

End of Day (30 min):
  ☑ Verify critical services still running
  ☑ Verify backups completed
  ☑ Review unresolved incidents
  ☑ Update all tickets
  ☑ Document all changes
  ☑ Handover to on-call team
```

---

## 📱 Mobile/Tablet Viewing

The console works on tablets but not optimized for mobile.

### Recommended screen sizes:
- **Desktop**: 1920x1080 or 1366x768 ✓ Optimized
- **Tablet**: 1024x768 (iPad landscape) ✓ Good
- **Mobile**: 414x896 (iPhone) - Readable but cramped

### Tips:
- Use landscape orientation on tablets
- Zoom in if text too small
- Tables may scroll horizontally
- All buttons still clickable

---

## 🔧 Customization

### Change Theme Colors

Edit the `:root` CSS variables in `<style>` section:

```css
:root {
  --bg: #0a0d12;           /* Dark background */
  --blue: #2fb6ff;         /* Primary blue */
  --orange: #ff6a1f;       /* Accent orange */
  --ok: #2fd08a;           /* Success green */
  --warn: #ffb020;         /* Warning yellow */
  --crit: #ff3b3b;         /* Critical red */
}
```

### Add More Domains

Edit domains in JavaScript:

```javascript
const domains = {
  "Windows": ["CMD", "PowerShell", ...],
  "MyDomain": ["Item1", "Item2", "Item3"],  // Add new
};
```

### Customize Checklists

Edit checklists for your team:

```javascript
const checklists = {
  "Morning": [
    "Your checklist item 1",
    "Your checklist item 2",
    ...
  ],
};
```

### Change Sample Data

Edit the `state` object to add your databases, keys, and devices:

```javascript
const state = {
  databases: [
    { name: "YourDB", server: "your-server.com", ... },
  ],
  keys: [
    { name: "Your API Key", value: "***", expiry: "2027-01-01" },
  ],
  devices: [
    { name: "Your Device", type: "Security Key", owner: "You" },
  ],
};
```

---

## 🌐 Deployment

### Local Testing
```bash
open index.html
```

### GitHub Pages (Free)
```bash
git push origin main
# Automatically deployed to:
# https://shingabhay-hub.github.io/GrtadminSystem/
```

### Docker (Local)
```bash
docker run -d -p 8080:80 \
  -v $(pwd):/usr/share/nginx/html \
  nginx:latest
# Visit: http://localhost:8080
```

### Nginx Server
```bash
# Copy files to /var/www/grt-console
# Access at: http://your-domain.com
```

See DEPLOYMENT.md for detailed deployment options.

---

## ❓ FAQs

### Q: Where is my data saved?
**A**: In your browser's memory (session). Data is lost when you refresh. To save permanently:
- Add localStorage support (requires code change)
- Connect to backend database
- Export to JSON file

### Q: Can I share data between browsers?
**A**: Not with current setup. To share:
- Deploy to server
- All browsers access same URL
- Data stored in backend database

### Q: Why do metrics update every 5 seconds?
**A**: Simulates real-time monitoring. In production:
- Connect to actual monitoring system
- Fetch from Prometheus, Grafana, etc.
- Update interval can be adjusted

### Q: How do I add HTTPS?
**A**: See DEPLOYMENT.md for:
- GitHub Pages (automatic)
- Nginx (Let's Encrypt)
- Docker (certificate mounting)

### Q: Can I customize the UI?
**A**: Yes! Edit:
- Colors in `:root` CSS variables
- Fonts in `font-family` properties
- Layout in `display: grid/flex` rules
- Content in JavaScript data structures

### Q: How do I add authentication?
**A**: Requires backend. Options:
- OAuth 2.0 (Google, GitHub)
- SAML (Enterprise SSO)
- OpenID Connect
- Custom JWT tokens

### Q: Is this production-ready?
**A**: For internal LAN: Yes
For public internet: Add:
- Authentication
- HTTPS/TLS
- Backend API
- Database
- Audit logging
- Rate limiting

---

## 🚀 Next Steps

### Level 1: Get Familiar
```
Time: 15 minutes
Goal: Explore all features

1. Open in browser
2. Click each tab
3. Read each section
4. Try adding one item
5. Review sample data
```

### Level 2: Populate with Your Data
```
Time: 1 hour
Goal: Enter your own data

1. Edit index.html - change sample databases
2. Add your team's API keys
3. Register your MFA devices
4. Create your process flows
5. Set your checklist items
```

### Level 3: Deploy to Production
```
Time: 30 minutes
Goal: Make accessible to team

1. Choose deployment option (GitHub Pages easiest)
2. Configure security (HTTPS, headers)
3. Set up monitoring
4. Test from multiple browsers
5. Share URL with team
```

### Level 4: Add Backend Integration
```
Time: 2-4 hours
Goal: Real data from actual systems

1. Build Node.js/Python API
2. Add database (PostgreSQL/MySQL)
3. Connect console to API
4. Fetch live metrics from monitoring tools
5. Store audit logs in database
```

---

## 📞 Support

### Common Issues

**Issue**: Page won't load
- Check browser console (F12 → Console tab)
- Look for red error messages
- Try different browser

**Issue**: Data disappears on refresh
- This is normal (in-memory storage)
- See "Add localStorage support" in next section
- Use export feature to save

**Issue**: Modals won't open
- Try closing with Escape key
- Hard refresh (Ctrl+Shift+R)
- Check browser console for errors

**Issue**: Metrics not updating
- Wait 5 seconds (auto-refresh interval)
- Try switching tabs and back
- Hard refresh browser

---

## 📚 Documentation

- **README.md** - Complete feature documentation
- **TESTING.md** - Comprehensive testing guide
- **DEPLOYMENT.md** - Deployment instructions
- **CHANGELOG.md** - Version history (when added)
- **API.md** - API documentation (when backend added)

---

## 🎓 Learning Resources

- [HTML/CSS/JavaScript Basics](https://developer.mozilla.org/en-US/)
- [Nginx Tutorial](https://www.nginx.com/resources/wiki/)
- [Docker Basics](https://docs.docker.com/get-started/)
- [Kubernetes Introduction](https://kubernetes.io/docs/concepts/overview/)

---

## ✅ You're Ready!

You now have:
✓ Fully functional operations console  
✓ DBA management system  
✓ Disaster recovery planner  
✓ Live monitoring dashboard  
✓ Security audit logging  

**Next**: Customize for your organization!

---

Version: 1.0  
Last Updated: August 16, 2026
