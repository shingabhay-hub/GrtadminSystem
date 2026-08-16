# GRT SysAdmin Operations Console - Deployment Guide

Complete instructions for deploying the GRT Operations Console to production.

---

## 🌍 Deployment Options

### Option 1: GitHub Pages (Recommended - Free)

#### Step 1: Push to GitHub
```bash
cd /workspaces/GrtadminSystem
git add .
git commit -m "Production release - v1.0"
git push origin main
```

#### Step 2: Enable GitHub Pages
1. Go to GitHub repository: https://github.com/shingabhay-hub/GrtadminSystem
2. Click Settings → Pages
3. Select:
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
4. Click Save

#### Step 3: Access Console
- **URL**: https://shingabhay-hub.github.io/GrtadminSystem/
- **Live in**: ~2-3 minutes

#### Verification
```bash
curl https://shingabhay-hub.github.io/GrtadminSystem/
# Should return HTML content (no 404)
```

---

### Option 2: Docker Container

#### Prerequisites
- Docker installed
- Docker Hub account (optional, for image registry)

#### Step 1: Create Dockerfile
```dockerfile
FROM nginx:latest

# Copy console files
COPY index.html /usr/share/nginx/html/
COPY README.md /usr/share/nginx/html/

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
```

#### Step 2: Build Image
```bash
docker build -t grt-admin-console:1.0 .
```

#### Step 3: Run Container
```bash
docker run -d \
  --name grt-console \
  -p 8080:80 \
  --restart unless-stopped \
  grt-admin-console:1.0

# Verify
curl http://localhost:8080/
```

#### Step 4: Push to Docker Hub (Optional)
```bash
docker tag grt-admin-console:1.0 shingabhay/grt-admin-console:1.0
docker push shingabhay/grt-admin-console:1.0
```

#### Step 5: Deploy to Production
```bash
# On production server:
docker pull shingabhay/grt-admin-console:1.0
docker run -d \
  --name grt-console-prod \
  -p 80:80 \
  --restart always \
  shingabhay/grt-admin-console:1.0
```

#### Health Check
```bash
docker logs grt-console-prod
docker stats grt-console-prod
```

---

### Option 3: Kubernetes Deployment

#### Prerequisites
- Kubernetes cluster (K8s 1.20+)
- kubectl configured
- Container image pushed to registry

#### Step 1: Create Deployment Manifest
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grt-admin-console
  namespace: operations
spec:
  replicas: 2
  selector:
    matchLabels:
      app: grt-console
  template:
    metadata:
      labels:
        app: grt-console
    spec:
      containers:
      - name: console
        image: shingabhay/grt-admin-console:1.0
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: grt-console-service
  namespace: operations
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: grt-console
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: grt-console-ingress
  namespace: operations
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - grt-console.yourdomain.com
    secretName: grt-console-tls
  rules:
  - host: grt-console.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: grt-console-service
            port:
              number: 80
```

#### Step 2: Deploy to Cluster
```bash
kubectl apply -f deployment.yaml

# Verify deployment
kubectl get deployment -n operations
kubectl get pods -n operations
kubectl get svc -n operations
```

#### Step 3: Monitor Health
```bash
kubectl logs -n operations -l app=grt-console -f
kubectl describe deployment grt-admin-console -n operations
```

---

### Option 4: Nginx on Linux Server

#### Prerequisites
- Linux server (Ubuntu 20.04+ recommended)
- sudo access
- Nginx installed

#### Step 1: Install Nginx
```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Step 2: Configure Virtual Host
```bash
# Create config file
sudo nano /etc/nginx/sites-available/grt-console

# Add this content:
server {
    listen 80;
    server_name grt-console.yourdomain.com;
    
    root /var/www/grt-console;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Cache static assets for 1 day
    location ~* \.(html|css|js)$ {
        expires 1d;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Step 3: Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/grt-console \
           /etc/nginx/sites-enabled/grt-console

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### Step 4: Deploy Files
```bash
# Create directory
sudo mkdir -p /var/www/grt-console

# Copy files
sudo cp index.html /var/www/grt-console/
sudo cp README.md /var/www/grt-console/

# Set permissions
sudo chown -R www-data:www-data /var/www/grt-console/
sudo chmod -R 755 /var/www/grt-console/
```

#### Step 5: Enable HTTPS (Optional - Recommended)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d grt-console.yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

#### Verification
```bash
curl https://grt-console.yourdomain.com/
```

---

### Option 5: Apache2 on Linux

#### Prerequisites
- Linux server
- Apache2 installed
- mod_rewrite enabled

#### Step 1: Install Apache
```bash
sudo apt update
sudo apt install -y apache2
sudo systemctl start apache2
sudo systemctl enable apache2
```

#### Step 2: Create Virtual Host
```bash
sudo nano /etc/apache2/sites-available/grt-console.conf

# Add content:
<VirtualHost *:80>
    ServerName grt-console.yourdomain.com
    ServerAdmin admin@yourdomain.com
    DocumentRoot /var/www/grt-console
    
    <Directory /var/www/grt-console>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        <IfModule mod_rewrite.c>
            RewriteEngine On
            RewriteBase /
            RewriteRule ^index\.html$ - [L]
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteRule . /index.html [L]
        </IfModule>
    </Directory>
    
    <FilesMatch "\.html$">
        Header set Cache-Control "max-age=86400, public"
    </FilesMatch>
    
    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
</VirtualHost>
```

#### Step 3: Enable Site
```bash
sudo a2ensite grt-console
sudo a2enmod rewrite
sudo a2enmod headers
sudo apache2ctl configtest  # Should say "Syntax OK"
sudo systemctl reload apache2
```

#### Step 4: Deploy Files
```bash
sudo mkdir -p /var/www/grt-console
sudo cp index.html /var/www/grt-console/
sudo chown -R www-data:www-data /var/www/grt-console/
```

---

### Option 6: Azure App Service

#### Prerequisites
- Azure account
- Azure CLI installed
- Resource group created

#### Step 1: Create App Service Plan
```bash
az appservice plan create \
  --name grt-console-plan \
  --resource-group myResourceGroup \
  --sku B1 \
  --is-linux
```

#### Step 2: Create Web App
```bash
az webapp create \
  --resource-group myResourceGroup \
  --plan grt-console-plan \
  --name grt-console-app \
  --runtime "node|16-lts"
```

#### Step 3: Deploy Files
```bash
# Option A: Using git
git remote add azure <your-azure-git-url>
git push azure main

# Option B: Using ZIP
cd /path/to/GrtadminSystem
zip -r app.zip .
az webapp deployment source config-zip \
  --resource-group myResourceGroup \
  --name grt-console-app \
  --src app.zip
```

#### Step 4: Configure
```bash
# Set app settings
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name grt-console-app \
  --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=false
```

#### Verification
```bash
az webapp show \
  --resource-group myResourceGroup \
  --name grt-console-app \
  --query "defaultHostName"
```

---

## 🔒 Security Hardening

### HTTPS/TLS
```bash
# Generate self-signed certificate (testing only)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Nginx configuration
listen 443 ssl http2;
ssl_certificate /path/to/cert.pem;
ssl_certificate_key /path/to/key.pem;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
```

### Security Headers
```nginx
# Add to Nginx config
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### Content Security Policy
```html
<!-- Add to index.html <head> -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com; 
               script-src 'self' 'unsafe-inline'">
```

### Authentication (External)
```javascript
// Example: Add before operations
async function checkAuth() {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    window.location.href = '/login';
    return false;
  }
  return true;
}
```

---

## 📊 Monitoring & Maintenance

### Health Check Endpoint
```bash
# Create health check script
#!/bin/bash
curl -f http://localhost/index.html > /dev/null || exit 1
exit 0
```

### Log Monitoring
```bash
# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check for 4xx/5xx errors
sudo grep -E "^.*HTTP/1.1\" [45]" /var/log/nginx/access.log | wc -l
```

### Performance Monitoring
```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 http://grt-console.yourdomain.com/

# With wrk
wrk -t12 -c400 -d30s http://grt-console.yourdomain.com/
```

### Automatic Backups
```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups/grt-console"
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" /var/www/grt-console/
find "$BACKUP_DIR" -mtime +30 -delete  # Keep last 30 days
```

---

## 🚀 CI/CD Pipeline (GitHub Actions)

### Automated Deployment
```yaml
# .github/workflows/deploy.yml
name: Deploy GRT Console

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Validate HTML
        run: |
          # Simple validation
          grep -q "<html" index.html
          grep -q "</html>" index.html
      
      - name: Test in browser (Lighthouse)
        uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: .
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

## ✅ Pre-Deployment Checklist

```
Before going live, verify:

Domain & SSL:
  ☑ Domain registered and DNS configured
  ☑ SSL certificate installed
  ☑ HTTPS working (no mixed content warnings)
  ☑ Redirect HTTP → HTTPS

Code:
  ☑ No console errors
  ☑ All tabs working
  ☑ Forms validated
  ☑ File upload tested
  
Security:
  ☑ Security headers configured
  ☑ CSP policy defined
  ☑ XSS protections enabled
  ☑ API keys not exposed
  
Performance:
  ☑ Page load < 2 seconds
  ☑ No unminified assets (optional)
  ☑ Fonts loading correctly
  ☑ Gzip compression enabled
  
Monitoring:
  ☑ Error logging configured
  ☑ Health checks set up
  ☑ Alert thresholds defined
  ☑ Backup strategy in place
  
Documentation:
  ☑ Deployment steps documented
  ☑ Rollback procedure written
  ☑ Support contact info ready
  ☑ SLA defined

Final Verification:
  ☑ Test in production environment
  ☑ Test all browsers
  ☑ Test on mobile
  ☑ Test all features
  ☑ Team sign-off received
```

---

## 🔄 Rollback Procedure

If issues occur after deployment:

### Immediate Rollback (Nginx)
```bash
# Disable broken version
sudo ln -s /etc/nginx/sites-available/grt-console-old \
           /etc/nginx/sites-enabled/grt-console
sudo rm /etc/nginx/sites-enabled/grt-console.new

# Reload
sudo nginx -t
sudo systemctl reload nginx
```

### Docker Rollback
```bash
# Stop new version
docker stop grt-console-prod

# Start previous version
docker run -d \
  --name grt-console-prod-v0 \
  -p 80:80 \
  shingabhay/grt-admin-console:0.9

# If successful, delete broken version
docker rmi grt-admin-console:1.0
```

### Kubernetes Rollback
```bash
# Check rollout history
kubectl rollout history deployment/grt-admin-console -n operations

# Rollback to previous
kubectl rollout undo deployment/grt-admin-console -n operations
```

---

## 📈 Post-Deployment Monitoring

```bash
# Monitor access logs
tail -f /var/log/nginx/access.log | grep -v "/health"

# Check error rate
grep "HTTP/1.1\" [45]" /var/log/nginx/access.log | wc -l

# Monitor CPU/Memory
top -p $(pgrep -f "nginx|docker|kubelet")

# Check uptime
uptime

# Test endpoints
curl -I https://grt-console.yourdomain.com/
curl -I https://grt-console.yourdomain.com/index.html
```

---

## 🎯 Success Criteria

Deployment is successful when:

✅ Console accessible via HTTPS  
✅ All tabs load without errors  
✅ Page load time < 2 seconds  
✅ CPU usage < 5% at rest  
✅ Memory usage < 100MB  
✅ 0 JavaScript console errors  
✅ Security headers present  
✅ Health checks passing  
✅ Backups configured  
✅ Monitoring alerts enabled  

---

Last Updated: August 16, 2026
