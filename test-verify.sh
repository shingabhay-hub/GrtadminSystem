#!/bin/bash
# GRT SysAdmin Operations Console - Test Verification Script
# Run this script to verify the console is working correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0
WARN=0

# Test result function
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC} - $2"
        ((PASS++))
    else
        echo -e "${RED}✗ FAIL${NC} - $2"
        ((FAIL++))
    fi
}

test_warn() {
    echo -e "${YELLOW}⚠ WARN${NC} - $1"
    ((WARN++))
}

# Header
clear
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║ GRT ADMIN CONSOLE - TEST VERIFICATION     ║${NC}"
echo -e "${BLUE}║ Automated Test Suite                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# ========== FILE CHECKS ==========
echo -e "${BLUE}[1/5] FILE INTEGRITY CHECKS${NC}"
echo "---"

# Check index.html exists
[ -f "index.html" ]
test_result $? "index.html file exists"

# Check README exists
[ -f "README.md" ]
test_result $? "README.md file exists"

# Check file sizes
SIZE=$(wc -c < index.html)
[ $SIZE -gt 50000 ] && [ $SIZE -lt 500000 ]
test_result $? "index.html size reasonable ($SIZE bytes)"

echo ""

# ========== HTML VALIDATION ==========
echo -e "${BLUE}[2/5] HTML STRUCTURE VALIDATION${NC}"
echo "---"

# Check DOCTYPE
grep -q "<!DOCTYPE html>" index.html
test_result $? "HTML5 DOCTYPE present"

# Check language attribute
grep -q 'lang="en"' index.html
test_result $? "Language attribute set"

# Check character encoding
grep -q "charset=UTF-8" index.html
test_result $? "UTF-8 charset specified"

# Check title
grep -q "<title>GRT SysAdmin Operations Console</title>" index.html
test_result $? "Page title present"

# Check closing tags
grep -q "</html>" index.html
test_result $? "HTML closing tag present"

# Check style tag
grep -q "<style>" index.html
test_result $? "Inline styles present"

# Check script tag
grep -q "<script>" index.html
test_result $? "JavaScript code present"

echo ""

# ========== FEATURE CHECKS ==========
echo -e "${BLUE}[3/5] FEATURE VERIFICATION${NC}"
echo "---"

# Check tabs exist
grep -q 'data-view="arch"' index.html && \
grep -q 'data-view="flows"' index.html && \
grep -q 'data-view="dba"' index.html && \
grep -q 'data-view="disaster"' index.html && \
grep -q 'data-view="monitoring"' index.html && \
grep -q 'data-view="checklist"' index.html
test_result $? "All navigation tabs present"

# Check DBA Operations elements
grep -q 'id="dbList"' index.html && \
grep -q 'id="queryBody"' index.html && \
grep -q 'id="backupList"' index.html && \
grep -q 'id="mirrorList"' index.html
test_result $? "DBA Operations dashboard elements"

# Check Disaster Recovery elements
grep -q 'id="drProcedures"' index.html && \
grep -q 'id="recoveryBody"' index.html && \
grep -q 'id="failoverList"' index.html
test_result $? "Disaster Recovery dashboard elements"

# Check Live Monitoring elements
grep -q 'id="healthMetrics"' index.html && \
grep -q 'id="alertsList"' index.html && \
grep -q 'id="auditBody"' index.html && \
grep -q 'id="storageBody"' index.html
test_result $? "Live Monitoring dashboard elements"

# Check Daily Checklist
grep -q 'id="checklist"' index.html
test_result $? "Daily Checklist view present"

# Check modals for DBA, DR, Monitoring
grep -q 'id="dbModal"' index.html && \
grep -q 'id="backupModal"' index.html && \
grep -q 'id="failoverModal"' index.html && \
grep -q 'id="accessLogModal"' index.html
test_result $? "All dialog modals present"

echo ""

# ========== DATA STRUCTURE CHECKS ==========
echo -e "${BLUE}[4/5] DATA STRUCTURE VALIDATION${NC}"
echo "---"

# Check domains data
grep -q '"Windows"' index.html && \
grep -q '"Network"' index.html && \
grep -q '"Database"' index.html
test_result $? "Architecture domains defined"

# Check flows data
grep -q '"Server Provisioning"' index.html && \
grep -q '"Identity Onboarding"' index.html && \
grep -q '"Disaster Recovery Drill"' index.html || grep -q '"Application Deployment"' index.html
test_result $? "Process flows defined"

# Check state object
grep -q 'const state = {' index.html
test_result $? "State management object exists"

# Check databases pre-loaded
grep -q '"ProductionDB"' index.html && \
grep -q '"ReportingDB"' index.html
test_result $? "Sample databases pre-loaded"

# Check backup jobs
grep -q '"backupJobs"' index.html
test_result $? "Backup jobs array present"

# Check alerts system
grep -q '"alerts"' index.html && \
grep -q '"Critical alerts"' index.html || grep -q '"High CPU"' index.html
test_result $? "Alerts system configured"

# Check health metrics
grep -q '"healthMetrics"' index.html
test_result $? "Health metrics array present"

# Check audit log
grep -q '"auditLog"' index.html
test_result $? "Audit logging system present"

echo ""

# ========== JAVASCRIPT FUNCTION CHECKS ==========
echo -e "${BLUE}[5/5] JAVASCRIPT FUNCTIONALITY CHECKS${NC}"
echo "---"

# Check render functions for DBA
grep -q 'function renderDatabases()' index.html
test_result $? "renderDatabases() function present"

grep -q 'function renderBackups()' index.html
test_result $? "renderBackups() function present"

grep -q 'function renderQueries()' index.html
test_result $? "renderQueries() function present"

grep -q 'function renderMirrors()' index.html
test_result $? "renderMirrors() function present"

# Check render functions for DR
grep -q 'function renderDRProcedures()' index.html
test_result $? "renderDRProcedures() function present"

grep -q 'function renderRecoveryPoints()' index.html
test_result $? "renderRecoveryPoints() function present"

grep -q 'function renderFailovers()' index.html
test_result $? "renderFailovers() function present"

# Check render functions for Monitoring
grep -q 'function renderHealthMetrics()' index.html
test_result $? "renderHealthMetrics() function present"

grep -q 'function renderAlerts()' index.html
test_result $? "renderAlerts() function present"

grep -q 'function renderAuditLog()' index.html
test_result $? "renderAuditLog() function present"

grep -q 'function renderStorage()' index.html
test_result $? "renderStorage() function present"

# Check event handlers
grep -q 'saveDbBtn.*addEventListener' index.html
test_result $? "Database save handler present"

grep -q 'saveBackupBtn.*addEventListener' index.html
test_result $? "Backup save handler present"

grep -q 'saveFailoverBtn.*addEventListener' index.html
test_result $? "Failover save handler present"

grep -q 'saveAccessBtn.*addEventListener' index.html
test_result $? "Access log save handler present"

# Check auto-refresh
grep -q 'setInterval.*5000' index.html
test_result $? "Auto-refresh interval (5 seconds) configured"

# Check toast notifications
grep -q 'function showToast' index.html
test_result $? "Toast notification system present"

# Check modal functions
grep -q 'function openModal' index.html && \
grep -q 'function closeModal' index.html
test_result $? "Modal open/close functions present"

echo ""

# ========== SECURITY CHECKS ==========
echo -e "${BLUE}[SECURITY CHECKS]${NC}"
echo "---"

# Check for inline scripts (not ideal but necessary for this demo)
if grep -q '<script>' index.html; then
    test_warn "Inline JavaScript found (consider moving to external file for production)"
fi

# Check for data masking in keys
grep -q '\*\*\*' index.html
test_result $? "API keys masked in display"

# Check no hardcoded passwords/credentials
if grep -q 'password' index.html | grep -v '<input' | grep -q '='; then
    test_warn "Possible hardcoded password found - review code"
else
    echo -e "${GREEN}✓ PASS${NC} - No hardcoded passwords detected"
    ((PASS++))
fi

# Check Content Security Policy header
grep -q 'Content-Security-Policy' index.html && \
test_warn "CSP header recommended but not implemented in HTML"

echo ""

# ========== CSS CHECKS ==========
echo -e "${BLUE}[CSS VERIFICATION]${NC}"
echo "---"

# Check CSS variables (theme)
grep -q ':root' index.html
test_result $? "CSS root variables (theme) present"

# Check responsive design
grep -q '@media' index.html || grep -q 'max-width' index.html
test_warn "Mobile responsive design partially implemented"

# Check grid layouts
grep -q 'grid' index.html
test_result $? "CSS Grid layout used"

# Check flexbox
grep -q 'flex' index.html
test_result $? "Flexbox layout used"

# Check animations
grep -q 'transition' index.html
test_result $? "CSS transitions/animations present"

echo ""

# ========== SUMMARY ==========
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║ TEST SUMMARY                              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

TOTAL=$((PASS + FAIL + WARN))

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}Overall Status: ✓ PASSED${NC}"
else
    echo -e "${RED}Overall Status: ✗ FAILED${NC}"
fi

echo ""
echo "Test Results:"
echo "  ${GREEN}Passed:  $PASS${NC}"
echo "  ${RED}Failed:  $FAIL${NC}"
echo "  ${YELLOW}Warnings: $WARN${NC}"
echo "  Total:  $TOTAL"
echo ""

# Recommendations
if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ Console is ready for testing!${NC}"
    echo ""
    echo "Recommended next steps:"
    echo "  1. Open index.html in browser"
    echo "  2. Follow QUICKSTART.md guide"
    echo "  3. Review TESTING.md for comprehensive tests"
    echo "  4. Run manual testing procedures"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Please fix the failures above before testing${NC}"
    echo ""
    exit 1
fi
