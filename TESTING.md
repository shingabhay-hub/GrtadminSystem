# GRT SysAdmin Operations Console - Testing Guide

Complete testing procedures for validating all features of the GRT Operations Console.

---

## 🧪 Test Environment Setup

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Developer tools open (F12) for console monitoring
- Mouse with drag-and-drop capability
- Sample files (optional, for attachment testing)

### Test Duration
- Quick Test: 15 minutes (core features only)
- Standard Test: 45 minutes (all features)
- Complete Test: 2 hours (includes performance, security, edge cases)

---

## 📋 Test Cases

### Test Suite 1: Architecture & Navigation (5 min)

#### TC1.1: Tab Navigation
```
Expected: Smooth switching between tabs
Steps:
1. Open index.html in browser
2. Click each tab (Architecture, Process Flows, DBA Operations, etc.)
3. Verify content changes smoothly
4. Verify tab styling changes (active state)
5. Click back to Architecture

Result: ✓ Pass / ✗ Fail
Evidence: Screenshot of each tab showing unique content
```

#### TC1.2: Architecture Expandable Domains
```
Expected: Domains expand/collapse on click
Steps:
1. Go to Architecture tab
2. See 8 domains: Windows, Network, Identity, Application, etc.
3. Click Windows domain → expands showing CMD, PowerShell, etc.
4. Click arrow changes color (blue → orange)
5. Click again → collapses
6. Test all 8 domains

Result: ✓ Pass / ✗ Fail
Evidence: Screenshot showing expanded domain with items
```

#### TC1.3: Real-Time Clock
```
Expected: Clock updates every second
Steps:
1. Open console, observe clock in header
2. Wait 10 seconds
3. Verify seconds increment
4. Check 24-hour format

Result: ✓ Pass / ✗ Fail
Evidence: Screenshot showing time
```

---

### Test Suite 2: DBA Operations (15 min)

#### TC2.1: Add Database
```
Expected: New database added to list
Steps:
1. Go to DBA Operations tab
2. See 2 pre-loaded databases (ProductionDB, ReportingDB)
3. Click "+ Add Database" button
4. Fill form:
   - Name: TestDB
   - Server: test-server.local
   - Type: PostgreSQL
   - RTO: 30
   - RPO: 10
5. Click "Save Database"
6. Verify TestDB appears in list
7. Verify toast notification: "Database added"

Result: ✓ Pass / ✗ Fail
Notes: TestDB should appear with correct RTO/RPO values
```

#### TC2.2: Remove Database
```
Expected: Database removed from list
Steps:
1. From previous test, find TestDB
2. Click "Remove" button
3. Verify TestDB disappears
4. Verify toast: "Database removed"

Result: ✓ Pass / ✗ Fail
```

#### TC2.3: Active Query Monitoring
```
Expected: See blocked/running queries
Steps:
1. Scroll to "Active Queries & Blocking" section
2. See table with 2 queries:
   - Query 1: ProductionDB, RUNNING
   - Query 2: ProductionDB, BLOCKED (Blocker: Yes)
3. Verify color coding (RUNNING green, BLOCKED red)
4. Click "Kill" button on Query 1
5. Verify toast: "Kill query..."

Result: ✓ Pass / ✗ Fail
```

#### TC2.4: Add Backup Job
```
Expected: Backup job added and scheduled
Steps:
1. Click "+ Add Backup Job" button
2. Fill form:
   - Database: ProductionDB
   - Type: Transaction Log
   - Schedule: Hourly
   - Destination: /backups/tlog
3. Click "Save Backup Job"
4. Verify job appears in "Backup Schedule" section
5. Verify schedule shows "Hourly"

Result: ✓ Pass / ✗ Fail
```

#### TC2.5: Database Mirroring Status
```
Expected: See mirror status and last sync time
Steps:
1. Scroll to "Database Mirroring Status"
2. See 2 mirrors:
   - ProductionDB ⇄ ProductionDB-DR (Synchronized)
   - ReportingDB ⇄ ReportingDB-Standby (Synchronizing)
3. Verify color coding:
   - Synchronized: Green badge
   - Synchronizing: Yellow badge
4. Check last sync timestamp format (YYYY-MM-DD HH:MM:SS)

Result: ✓ Pass / ✗ Fail
```

---

### Test Suite 3: Disaster Recovery (10 min)

#### TC3.1: DR Procedures Display
```
Expected: See RTO/RPO targets and procedures
Steps:
1. Go to Disaster Recovery tab
2. See section: "DR Procedures & RTO/RPO Targets"
3. Verify 3 systems displayed:
   - Production Database Cluster (RTO: 15 min, RPO: 5 min)
   - Application Server Pool (RTO: 5 min, RPO: 0 min)
   - File Server (RTO: 30 min, RPO: 15 min)
4. Verify procedure text displays correctly
5. Check flow format shows "RTO: X | RPO: Y"

Result: ✓ Pass / ✗ Fail
```

#### TC3.2: Recovery Point History
```
Expected: See recovery points with timestamps
Steps:
1. Scroll to "Recovery Point History"
2. See table with columns:
   - Date/Time, Type, System, Status, Action
3. Verify 2 recovery points:
   - Full Backup (ProductionDB, OK)
   - Transaction Log (ProductionDB, OK)
4. Status badges show green (OK)
5. Click "Restore" button
6. Verify toast: "Restore from [timestamp]"

Result: ✓ Pass / ✗ Fail
```

#### TC3.3: Add Failover Plan
```
Expected: New failover plan created
Steps:
1. Click "+ New Failover Entry"
2. Fill form:
   - System Name: DR-Test-System
   - Primary Site: Main DataCenter
   - Secondary Site: Backup DataCenter
   - Procedure: Manual restart required
3. Click "Save Failover Plan"
4. Verify plan appears in list
5. Verify status shows "Standby"
6. Click "Test Failover" button
7. Verify toast: "Initiating failover simulation..."

Result: ✓ Pass / ✗ Fail
```

#### TC3.4: Test Failover Simulation
```
Expected: Failover test can be initiated
Steps:
1. From previous test, see new failover plan
2. Click "Test Failover" button
3. Observe toast notification
4. Plan status should remain "Standby" (test didn't actually fail over)
5. Return to Monitoring tab
6. Check if new alert triggered

Result: ✓ Pass / ✗ Fail
```

---

### Test Suite 4: Live Monitoring (12 min)

#### TC4.1: Health Metrics Display
```
Expected: See 6 real-time metrics with auto-refresh
Steps:
1. Go to Live Monitoring tab
2. See "System Health Dashboard" with 6 metric cards:
   - Database Health: 98 %
   - Replication Lag: 0.8 sec
   - Backup Success: 100 %
   - Storage Used: 67 %
   - Connection Pool: 245 active
   - Query Wait Time: 2.3 ms
3. Observe metrics for 10 seconds
4. Verify at least one value changes (auto-refresh)
5. Check all units display correctly

Result: ✓ Pass / ✗ Fail
Evidence: Screenshot showing metric values
```

#### TC4.2: Active Alerts
```
Expected: See severity-colored alerts
Steps:
1. Scroll to "Active Alerts & Exceptions"
2. See 4 alerts:
   - Alert 1: High CPU (Warning - yellow)
   - Alert 2: Backup Delayed (Critical - red)
   - Alert 3: Replication Lag (Warning - yellow)
   - Alert 4: Disk Space (Info - blue)
3. Verify time stamps show (15:42, 15:35, etc.)
4. Verify correct border colors per severity
5. Check alert messages are readable

Result: ✓ Pass / ✗ Fail
```

#### TC4.3: User Access Audit Log
```
Expected: See audit entries with user actions
Steps:
1. Scroll to "User Access Audit Log"
2. See table with columns:
   - Timestamp, User, Action, Resource, Result
3. Verify 3 sample entries:
   - abhay.admin LOGIN (Success - green)
   - srini.dba MODIFY (Success - green)
   - unknown.user LOGIN (Denied - red)
4. Check result badges are color-coded
5. Note: "Log Access Event" button available

Result: ✓ Pass / ✗ Fail
```

#### TC4.4: Add Access Log Entry
```
Expected: New audit entry logged with timestamp
Steps:
1. Click "+ Log Access Event" button
2. Fill form:
   - Username: testuser.admin
   - Action: Login
   - Resource: prod-server-03
   - Result: Success
3. Click "Log Event"
4. Verify toast: "Access event logged"
5. Scroll up in audit log
6. Verify new entry appears at TOP (most recent first)
7. Timestamp should be current time

Result: ✓ Pass / ✗ Fail
Notes: New entries should appear at top of list
```

#### TC4.5: Storage & Disk Pairing
```
Expected: See SAN array synchronization status
Steps:
1. Scroll to "Storage & Disk Pairing"
2. See table with columns:
   - Storage Array, Primary, Secondary, Sync Status, Last Sync
3. Verify 2 arrays:
   - SAN-01: 500/750 GB | 487/750 GB | Synchronized
   - SAN-02: 320/500 GB | 318/500 GB | Synchronized
4. Check sync status badges (green)
5. Verify last sync timestamps format

Result: ✓ Pass / ✗ Fail
```

---

### Test Suite 5: Daily Checklist (8 min)

#### TC5.1: Checklist Display
```
Expected: See 3 checklist groups with items
Steps:
1. Go to Daily Checklist tab
2. See 3 groups:
   - Morning (10 items)
   - During Day (8 items)
   - End of Day (6 items)
3. Verify each group shows "0/X" completed
4. Check all items are readable
5. See progress bar (should be empty)

Result: ✓ Pass / ✗ Fail
```

#### TC5.2: Check Items
```
Expected: Checkmarks update progress bar
Steps:
1. Click checkbox for first Morning item
2. Verify item text becomes strikethrough/dimmed
3. Check counter updates to "1/10"
4. Observe progress bar fills 10%
5. Check 5 more items
6. Verify counter shows "6/10"
7. Verify progress bar at 60%

Result: ✓ Pass / ✗ Fail
```

#### TC5.3: Reset Checklist
```
Expected: All items uncheck, progress resets
Steps:
1. From previous test (6/10 completed)
2. Click "Reset All Checklists" button at bottom
3. Verify all checkmarks disappear
4. Verify counter resets to "0/10" for all groups
5. Verify progress bars empty

Result: ✓ Pass / ✗ Fail
```

#### TC5.4: Checklist Persistence in Session
```
Expected: Checked items persist while tab is open
Steps:
1. Check 3 items in Morning checklist
2. Switch to Process Flows tab
3. Switch back to Daily Checklist tab
4. Verify 3 items still checked
5. Verify counter shows "3/10"

Result: ✓ Pass / ✗ Fail
Notes: Data lost on page refresh (in-memory storage)
```

---

### Test Suite 6: Severity Matrix (3 min)

#### TC6.1: Severity Definitions
```
Expected: See all SEV1-SEV8 levels with definitions
Steps:
1. Go to Severity Matrix tab
2. See table with 2 columns: Severity, Definition
3. Verify 8 rows:
   - SEV1: Production completely unavailable (red badge)
   - SEV2: Major business outage (red badge)
   - SEV3: Major functionality unavailable (yellow badge)
   - SEV4: Multiple users affected (yellow badge)
   - SEV5: Limited functionality (green badge)
   - SEV6: Individual/team impact (green badge)
   - SEV7: Information / Request (green badge)
   - SEV8: Minor issue (green badge)
4. Verify color coding matches severity

Result: ✓ Pass / ✗ Fail
```

---

### Test Suite 7: Attachments Manager (8 min)

#### TC7.1: Empty State
```
Expected: No attachments initially
Steps:
1. Go to Attachments tab
2. See drop zone with message "Drop files here or click to browse"
3. See "Stored Attachments" section
4. Verify empty state message: "No attachments saved yet."
5. Verify attachment count shows "0 files"

Result: ✓ Pass / ✗ Fail
```

#### TC7.2: Click to Browse
```
Expected: File browser opens
Steps:
1. Click drop zone area
2. System file browser should open
3. Select a text file (e.g., sample.txt)
4. Close/Cancel browser

Result: ✓ Pass / ✗ Fail
Notes: File not actually uploaded in this test
```

#### TC7.3: Add Text File
```
Expected: Text file uploaded with preview
Steps:
1. Create test.txt with content:
   ```
   This is a test file
   Line 2
   Line 3
   ```
2. Drag-drop test.txt onto drop zone
3. Verify toast: "Added test.txt"
4. Verify attachment appears in list with:
   - TXT badge
   - test.txt name
   - File size
5. Click "Preview" button
6. New window opens showing file content
7. Close preview window

Result: ✓ Pass / ✗ Fail
```

#### TC7.4: Add JSON File
```
Expected: JSON file with preview capability
Steps:
1. Create test.json:
   ```json
   {"name": "ProductionDB", "status": "healthy"}
   ```
2. Drag-drop onto drop zone
3. Verify file appears with JSON preview option
4. Click "Preview" button
5. Verify content displays in new window

Result: ✓ Pass / ✗ Fail
```

#### TC7.5: Remove Attachment
```
Expected: File removed from list
Steps:
1. See test.txt in attachments
2. Click "Remove" button
3. Verify file disappears
4. Verify empty state message returns
5. Verify count shows "0 files"
6. Toast: "Attachment removed"

Result: ✓ Pass / ✗ Fail
```

#### TC7.6: Drag-Drop Feedback
```
Expected: Visual feedback during drag-drop
Steps:
1. See drop zone with default styling
2. Drag file over drop zone
3. Verify zone highlights (blue border, light blue background)
4. Drag file out → highlight disappears
5. Drop file in → highlight disappears

Result: ✓ Pass / ✗ Fail
```

---

### Test Suite 8: Access & Keys (8 min)

#### TC8.1: View API Keys
```
Expected: See 2 pre-loaded keys
Steps:
1. Go to Access & Keys tab
2. See "API Keys & Credentials" section
3. Verify 2 keys displayed:
   - Azure Storage Connection (Expires: 2026-10-15)
   - SMTP Relay Secret (No expiry set)
4. Verify values are partially masked with *
5. Check "Remove" buttons available

Result: ✓ Pass / ✗ Fail
```

#### TC8.2: Add API Key
```
Expected: New key added to list
Steps:
1. Click "+ Add Key" button
2. Fill form:
   - Name: GitHub API Token
   - Value: ghp_xxxxxxxxxxxx
   - Expiry: 2026-12-31
3. Click "Save Key"
4. Verify toast: "Key added"
5. Verify new key appears in list
6. Verify expiry date displays

Result: ✓ Pass / ✗ Fail
```

#### TC8.3: Remove API Key
```
Expected: Key deleted from list
Steps:
1. Find GitHub API Token key
2. Click "Remove" button
3. Verify toast: "Key removed"
4. Verify key disappears

Result: ✓ Pass / ✗ Fail
```

#### TC8.4: View MFA Devices
```
Expected: See 2 pre-loaded devices
Steps:
1. Scroll to "Registered Devices / MFA"
2. Verify 2 devices:
   - YubiKey 5C (Security Key, Owner: Abhay, Active - green)
   - iPhone Authenticator (Authenticator App, Owner: Operations, Review - yellow)
3. Check status pills display correct colors
4. Check "Remove" buttons available

Result: ✓ Pass / ✗ Fail
```

#### TC8.5: Add MFA Device
```
Expected: New device registered
Steps:
1. Click "+ Add Device" button
2. Fill form:
   - Device Name: MacBook Pro Authenticator
   - Type: Authenticator App
   - Owner: Security Team
3. Click "Save Device"
4. Verify toast: "Device registered"
5. Verify device appears with:
   - Device name and type
   - Owner attribution
   - Status: Active (green)

Result: ✓ Pass / ✗ Fail
```

#### TC8.6: Remove Device
```
Expected: Device removed from list
Steps:
1. Find MacBook Pro device
2. Click "Remove" button
3. Verify toast: "Device removed"
4. Verify device disappears

Result: ✓ Pass / ✗ Fail
```

---

### Test Suite 9: Process Flows (5 min)

#### TC9.1: View All Workflows
```
Expected: See 7 process flow diagrams
Steps:
1. Go to Process Flows tab
2. Verify 7 flows display:
   1. Server Provisioning (14 Steps)
   2. Identity Onboarding (10 steps)
   3. Application Deployment (8 steps)
   4. Web Request Path (10 steps)
   5. Change Management (8 steps)
   6. Disk Full Triage (9 steps)
   7. Scheduled Task Failure (9 steps)
3. Verify step flow with arrows: Step → Step → Step
4. Check all steps are readable
5. No scroll needed (all visible on single scroll)

Result: ✓ Pass / ✗ Fail
```

#### TC9.2: Flow Readability
```
Expected: All steps readable with proper formatting
Steps:
1. Pick "Server Provisioning" flow
2. Read each step: Confirm hostname → Confirm IP → Confirm DNS → ...
3. Verify arrows show direction (→)
4. Verify font is monospace and readable
5. Count steps (should match title)

Result: ✓ Pass / ✗ Fail
```

---

### Test Suite 10: Modal Dialogs (6 min)

#### TC10.1: Modal Open/Close
```
Expected: Modals appear centered and can close
Steps:
1. Go to DBA Operations tab
2. Click "+ Add Database"
3. Modal appears centered with dark overlay
4. Modal has title, form fields, Save/Cancel buttons
5. Click "Cancel" button
6. Modal closes, overlay disappears
7. Verify no errors in console

Result: ✓ Pass / ✗ Fail
```

#### TC10.2: Form Validation
```
Expected: Empty fields show error
Steps:
1. Open "+ Add Database" modal
2. Leave all fields empty
3. Click "Save Database"
4. Verify toast: "Database name and server are required"
5. Modal stays open (not submitted)
6. Click Cancel

Result: ✓ Pass / ✗ Fail
```

#### TC10.3: Modal Close with Escape
```
Expected: Pressing Escape closes modal
Steps:
1. Open any modal (e.g., Add Database)
2. Press Escape key on keyboard
3. Modal closes
4. Verify overlay gone

Result: ✓ Pass / ✗ Fail
```

#### TC10.4: Modal Data Clearing
```
Expected: Form fields clear after successful submission
Steps:
1. Open "+ Add Database"
2. Fill all fields with data
3. Click "Save Database"
4. Verify toast: "Database added"
5. Modal closes
6. Click "+ Add Database" again
7. Verify form fields are EMPTY (previous data cleared)
8. Cancel

Result: ✓ Pass / ✗ Fail
```

---

### Test Suite 11: Notifications (4 min)

#### TC11.1: Toast Notifications
```
Expected: Toast messages appear and auto-dismiss
Steps:
1. Perform action: Add database
2. See toast at bottom center: "Database added"
3. Observe toast:
   - Background: dark panel
   - Text: light blue
   - Border: blue line
4. After 1.8 seconds, toast fades away
5. Verify smooth fade transition
6. No toast should remain after 3 seconds

Result: ✓ Pass / ✗ Fail
```

#### TC11.2: Multiple Toasts
```
Expected: Toasts appear sequentially
Steps:
1. Add database → Toast appears
2. Add key → Toast appears (replaces previous)
3. Add device → Toast appears
4. Verify toast always at bottom, replacing previous
5. Verify text reads correctly for each action

Result: ✓ Pass / ✗ Fail
```

---

### Test Suite 12: Performance & Responsiveness (10 min)

#### TC12.1: Page Load Time
```
Expected: Page loads quickly
Steps:
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Open Developer Tools → Network tab
4. Measure load time
5. Check: All resources load < 2 seconds
6. Verify no failed requests
7. Check Console for errors (should be empty)

Result: ✓ Pass / ✗ Fail
Metrics:
  - DOM Content Loaded: ___ ms
  - Full Page Load: ___ ms
  - Failed Resources: ___
  - Console Errors: ___
```

#### TC12.2: CPU Usage During Auto-Refresh
```
Expected: Monitoring tab auto-refresh has minimal CPU impact
Steps:
1. Go to Live Monitoring tab
2. Open Task Manager (Windows) or Activity Monitor (Mac)
3. Monitor browser CPU usage for 30 seconds
4. Note baseline CPU % (should be < 5% idle)
5. Observe metrics update every 5 seconds
6. CPU should stay low (< 2% during update)

Result: ✓ Pass / ✗ Fail
Metrics:
  - Baseline CPU: ___ %
  - Peak During Update: ___ %
  - Memory Usage: ___ MB
```

#### TC12.3: Large Checklist Performance
```
Expected: Checklist renders smoothly with many items
Steps:
1. Go to Daily Checklist
2. Total items: ~24 (Morning + During + End of Day)
3. Check all items rapidly (10+ in succession)
4. Observe progress bar updates smoothly
5. No lag or jank
6. UI remains responsive

Result: ✓ Pass / ✗ Fail
Notes: May add stress test with 100+ items in future
```

#### TC12.4: Modal Responsiveness
```
Expected: Form submission instant
Steps:
1. Open Add Database modal
2. Fill form completely
3. Click Save
4. Modal closes immediately (< 100ms)
5. Item appears in list
6. No lag or freezing

Result: ✓ Pass / ✗ Fail
```

---

### Test Suite 13: Browser Compatibility (15 min)

#### TC13.1: Chrome / Chromium Edge
```
Browser: Chrome / Edge 90+
Expected: All features work perfectly

Tests to run:
  ✓ All tabs and views
  ✓ Modals and animations
  ✓ File upload (drag-drop)
  ✓ Real-time metrics
  ✓ Progress bars
  ✓ Auto-refresh
  ✓ Console (no errors)

Result: ✓ Pass / ✗ Fail
Console Errors: ___________
```

#### TC13.2: Firefox
```
Browser: Firefox 88+
Expected: All features work perfectly

Tests to run:
  ✓ Same as Chrome test
  ✓ Check CSS grid layout
  ✓ Verify animations smooth
  ✓ File upload functionality

Result: ✓ Pass / ✗ Fail
Notes: ___________________
```

#### TC13.3: Safari
```
Browser: Safari 14+
Expected: All features work (may have minor differences)

Tests to run:
  ✓ Core functionality
  ✓ Modals and forms
  ✓ Animations (may be slightly less smooth)
  ✓ File upload

Result: ✓ Pass / ✗ Fail
Known Issues: _____________
```

---

### Test Suite 14: Security Testing (10 min)

#### TC14.1: XSS Prevention
```
Expected: Script tags are escaped, not executed
Steps:
1. Go to Daily Checklist
2. Try to add item with script tag (not possible in UI)
3. Go to DBA Operations
4. Add Database with name: <script>alert('XSS')</script>
5. Click Save
6. Verify:
   - No alert popup
   - Database name displays as literal text (escaped)
   - No console errors

Result: ✓ Pass / ✗ Fail
```

#### TC14.2: API Key Masking
```
Expected: API keys show partial value only
Steps:
1. Go to Access & Keys
2. See Azure Storage Connection key
3. Value displays as: DefaultAzureStorageKey***
4. Verify only last characters hidden (not entire key)
5. Full value never displayed in UI

Result: ✓ Pass / ✗ Fail
```

#### TC14.3: Session Isolation
```
Expected: Each browser tab has independent session
Steps:
1. Open console in Tab 1
2. Add database "Tab1DB"
3. Open same page in Tab 2
4. Verify Tab 2 shows ONLY default databases (not Tab1DB)
5. Confirm each session isolated in memory
6. Return to Tab 1, verify Tab1DB still there

Result: ✓ Pass / ✗ Fail
```

#### TC14.4: No External Network Calls
```
Expected: Console shows no network requests to external APIs
Steps:
1. Open DevTools → Network tab
2. Clear all
3. Refresh page
4. Perform operations: Add DB, Add Key, Log Access
5. Verify Network tab shows ONLY local resources (HTML, CSS)
6. No requests to external APIs, CDNs, or tracking services
7. Note: Fonts load from Google Fonts (external, by design)

Result: ✓ Pass / ✗ Fail
External Requests: ________
```

---

### Test Suite 15: Real-World Scenarios (15 min)

#### Scenario 1: Daily Operations Workflow
```
Timeline: 8:00 AM - 5:00 PM

8:00 AM - Morning Checklist:
1. Go to Daily Checklist tab
2. Expand Morning checklist
3. Check items:
   ☑ Check monitoring dashboard
   ☑ Check critical alerts
   ☑ Check server availability
   ☑ Check CPU/RAM
4. Observe progress: 4/10 (40%)
5. Switch to Monitoring tab
6. Observe health metrics
7. See 4 active alerts
8. Note: CPU 87%, Backup delayed, Replication lag

9:00 AM - DBA Check:
1. Go to DBA Operations
2. See 2 active queries (1 blocked)
3. Review backup jobs (all scheduled)
4. Check mirroring status (2 synchronized)

11:00 AM - Incident Event:
1. Add alert in monitoring: "Database connection pool at 95%"
2. Log access: admin, Modify, ProductionDB, Success
3. Kill blocking query

5:00 PM - End of Day:
1. Go to Daily Checklist
2. Complete End of Day items
3. Export/Archive attachments if needed
4. Reset for next day

Result: ✓ Pass / ✗ Fail - All operations completed smoothly
```

#### Scenario 2: Disaster Recovery Drill
```
Objective: Test failover procedures

1. Go to Disaster Recovery tab
2. Review RTO/RPO targets
   - Production DB: RTO 15m, RPO 5m
3. Check recovery point history
   - Latest backup: Full Backup (OK)
4. Create new failover plan:
   - System: Web App Cluster
   - Primary: DC-A
   - Secondary: DC-B
5. Add access log: admin, Modify, Failover, Success
6. Simulate failover: Click "Test Failover"
7. Check monitoring tab for alerts
8. Document RTO/RPO achieved
9. Verify all audit entries logged

Result: ✓ Pass / ✗ Fail - Failover procedure documented
```

#### Scenario 3: Security Audit
```
Objective: Review all access and security events

1. Go to Monitoring tab
2. Review audit log (User Access Audit Log)
   - Check last 10 entries
   - Verify Success/Denied/Failure tracking
   - Note: 2026-08-16 15:45:12 abhay.admin LOGIN Success
3. Go to Access & Keys tab
4. Review API keys
   - Note expiry dates
   - Identify expired keys (if any)
5. Review MFA devices
   - Verify all devices have owner
   - Check status (Active/Review/Critical)
6. Create security log entry:
   - User: security.admin
   - Action: View
   - Resource: KeyVault
   - Result: Success
7. Export audit log for compliance

Result: ✓ Pass / ✗ Fail - All audit entries verified
```

---

## 🔍 Defect Reporting Template

When you find a bug, use this template:

```
Title: [Tab/Feature] - [Issue description]
Severity: Critical / High / Medium / Low

Steps to Reproduce:
1. Step 1
2. Step 2
3. Step 3

Expected Result:
[What should happen]

Actual Result:
[What actually happens]

Screenshots:
[Paste screenshot or attachment]

Browser/OS:
Chrome 120 on Windows 11

Console Errors:
[Copy from DevTools Console]

Additional Notes:
[Any other info]
```

---

## ✅ Test Sign-Off

After completing all test suites, sign off:

```
Project: GRT SysAdmin Operations Console
Tested By: ________________
Date: ________________
Build Version: 1.0

Test Coverage:
  ✓ Architecture & Navigation
  ✓ DBA Operations
  ✓ Disaster Recovery
  ✓ Live Monitoring
  ✓ Daily Checklist
  ✓ Severity Matrix
  ✓ Attachments
  ✓ Access & Keys
  ✓ Process Flows
  ✓ Modals & Forms
  ✓ Notifications
  ✓ Performance
  ✓ Browser Compatibility
  ✓ Security
  ✓ Real-World Scenarios

Total Test Cases: 100+
Passed: ___
Failed: ___
Skipped: ___
Overall Result: ✓ PASS / ✗ FAIL

Known Issues:
1. [Issue 1]
2. [Issue 2]

Recommendation: ✓ APPROVED / ✗ NEEDS FIXES

Signature: ________________
```

---

## 📊 Quick Test Checklist (15 min)

For quick verification before deployment:

- [ ] Open in Chrome → All tabs load
- [ ] Add database in DBA Operations → Success toast
- [ ] Check Live Monitoring → Metrics auto-refresh
- [ ] Add checklist item → Progress updates
- [ ] Add key in Access & Keys → Key appears
- [ ] Check Disaster Recovery → Failover plan works
- [ ] Open DevTools Console → No errors
- [ ] Test Failover button → Toast appears
- [ ] All modals close properly (Cancel + Escape)
- [ ] Toast notifications auto-dismiss

**Result**: ✓ READY / ✗ NOT READY

---

Last Updated: August 16, 2026
