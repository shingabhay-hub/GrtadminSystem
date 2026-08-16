# GRT Admin Console - Docker Compose Setup

Complete containerized deployment of the GRT SysAdmin Operations Console with frontend, backend API, database, caching, monitoring, and logging stack.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Traefik Reverse Proxy                  │
│                   (Port 80, 443, 8080)                   │
└──┬────────────────────────────────────────────────────┬──┘
   │                                                      │
   ├──────────────────┐                        ┌──────────┤
   │                  │                        │          │
┌──▼──────────────┐  │    ┌──────────────┐   │   ┌──────▼──────┐
│ Nginx Frontend  │  │    │ Express API  │   │   │   Grafana   │
│  (Port 80)      │  │    │ (Port 5000)  │   │   │  (Port 3000)│
└─────────────────┘  │    └──────┬───────┘   │   └─────────────┘
                     │           │           │
                     │       ┌───▼────────┐  │
                     │       │  MongoDB   │  │
                     │       │ (Port 27)  │  │
                     │       └────────────┘  │
                     │                       │
                     │       ┌───────────┐   │
                     │       │   Redis   │   │
                     │       │ (Port 6379)  │
                     │       └───────────┘   │
                     │                       │
                     │    ┌──────────────┐  │
                     │    │ Prometheus   │  │
                     │    │ (Port 9090) │  │
                     │    └──────────────┘  │
                     │                       │
                     │  ┌──────────────────┐│
                     │  │ Elasticsearch    ││
                     │  │  (Port 9200)    ││
                     │  └──────────────────┘│
                     │                       │
                     └───────────────────────┘
```

## Services Included

- **Frontend**: Nginx serving static HTML/CSS/JS
- **Backend API**: Node.js/Express REST API
- **Database**: MongoDB for data persistence
- **Cache**: Redis for sessions and caching
- **Monitoring**: Prometheus for metrics collection
- **Visualization**: Grafana for dashboards
- **Logging**: Elasticsearch for log aggregation
- **Reverse Proxy**: Traefik for load balancing and SSL

## Quick Start

### Prerequisites
- Docker (version 20.10+)
- Docker Compose (version 2.0+)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/shingabhay-hub/GrtadminSystem.git
cd GrtadminSystem

# Copy environment file
cp .env.docker .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

The console will be available at:
- **Frontend**: http://localhost
- **API**: http://localhost/api
- **Grafana**: http://localhost:3000
- **Prometheus**: http://localhost:9090
- **Traefik**: http://localhost:8080

### First Time Setup

```bash
# Wait for services to start (30-60 seconds)
docker-compose ps

# Check backend health
curl http://localhost:5000/api/health

# Access frontend
open http://localhost

# Login to Grafana (default: admin/admin)
open http://localhost:3000
```

## Configuration

Edit `.env` file to customize:

```bash
# Database
MONGO_USER=your_user
MONGO_PASSWORD=your_password

# Cache
REDIS_PASSWORD=your_redis_password

# Grafana
GRAFANA_PASSWORD=your_grafana_password

# Email notifications
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service_name]

# Restart specific service
docker-compose restart backend

# View service details
docker-compose ps
docker-compose inspect [service_name]

# Access service shell
docker-compose exec backend sh
docker-compose exec mongodb mongosh

# View resource usage
docker stats

# Prune unused containers/images
docker system prune -a --volumes
```

## Service Details

### Frontend (Nginx)
- Port: 80
- Configuration: `nginx.conf`
- Features: Reverse proxy, compression, rate limiting, security headers

### Backend API (Express.js)
- Port: 5000
- Entry: `backend/server.js`
- Features: RESTful API, middleware, authentication

### Database (MongoDB)
- Port: 27017
- Volume: `mongodb_data`
- Initial: Configured with grt_admin database

### Cache (Redis)
- Port: 6379
- Volume: `redis_data`
- Features: Sessions, data caching

### Monitoring (Prometheus)
- Port: 9090
- Config: `prometheus.yml`
- Scrape: 15s interval

### Visualization (Grafana)
- Port: 3000
- Datasources: Prometheus, Elasticsearch
- User: admin (default password in .env)

### Logging (Elasticsearch)
- Port: 9200
- Volume: `elasticsearch_data`
- Single node setup

### Reverse Proxy (Traefik)
- Port: 8080 (dashboard)
- Config: `traefik.yml`
- Features: Dynamic routing, SSL termination

## Networking

Services communicate via `grt-network` bridge network:
- Subnet: 172.28.0.0/16
- Services accessible by container name (e.g., `http://backend:5000`)

## Volumes

Persistent storage:
- `mongodb_data`: MongoDB database files
- `mongodb_config`: MongoDB configuration
- `redis_data`: Redis dump files
- `prometheus_data`: Prometheus metrics
- `grafana_data`: Grafana dashboards and datasources
- `elasticsearch_data`: Elasticsearch indices

## Health Checks

All services include health checks:
```bash
# View health status
docker-compose ps

# Manual health test
curl http://localhost:5000/api/health
```

## Monitoring & Alerts

### Prometheus Queries
```
# API response time
histogram_quantile(0.95, http_request_duration_seconds)

# Error rate
rate(http_requests_total{status=~"5.."}[5m])

# Database connections
mongodb_connections_total
```

### Grafana Dashboards
1. System Overview
2. API Performance
3. Database Metrics
4. Error Tracking
5. Business Analytics

## Scaling

### Horizontal Scaling
```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3
```

### Load Balancing
Traefik automatically load balances across scaled instances.

## Security

- Non-root user in containers
- Network isolation via Docker network
- Secrets management via environment variables
- CORS configuration
- Rate limiting
- Security headers

### Securing for Production

```bash
# 1. Change all default passwords
# 2. Enable HTTPS/TLS
# 3. Set up firewall rules
# 4. Configure backup strategy
# 5. Enable audit logging
# 6. Set up monitoring and alerts
```

## Backup & Recovery

### Automated Backups
```bash
# Backup MongoDB
docker-compose exec mongodb mongodump --out /backup

# Backup volumes
docker run --rm \
  -v grtadminsystem_mongodb_data:/data \
  -v /backup:/backup \
  ubuntu tar czf /backup/mongodb.tar.gz -C /data .
```

### Restore
```bash
# Restore MongoDB
docker-compose exec mongodb mongorestore /backup
```

## Performance Tuning

### Optimize Database
```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh

# Create indexes
db.collection.createIndex({ field: 1 })
db.collection.getIndexes()
```

### Optimize Cache
```bash
# Monitor Redis
docker-compose exec redis redis-cli INFO stats
```

### View Resource Usage
```bash
docker stats --no-stream
```

## Troubleshooting

### Services Won't Start
```bash
# Check logs
docker-compose logs --tail=50

# Verify Docker daemon
docker ps

# Free up resources
docker system prune
```

### Network Issues
```bash
# Test connectivity
docker-compose exec backend ping mongodb
docker-compose exec backend curl http://mongodb:27017

# View network
docker network inspect grtadminsystem_grt-network
```

### Performance Issues
```bash
# Check container stats
docker stats

# View resource limits
docker inspect grtadminsystem_backend --format='{{.HostConfig.Resources}}'
```

### Database Connection Errors
```bash
# Test MongoDB connection
docker-compose exec backend mongo mongodb://admin:password@mongodb:27017

# Check MongoDB logs
docker-compose logs mongodb
```

## Production Deployment

### AWS EC2
```bash
# 1. Launch EC2 instance (t3.medium+)
# 2. Install Docker and Docker Compose
# 3. Clone repository
# 4. Configure .env for production
# 5. Run docker-compose up -d
# 6. Set up CloudWatch monitoring
```

### Azure Container Instances
```bash
# Convert to Azure deployment
az container create \
  --resource-group grt-admin \
  --file docker-compose.yml
```

### Kubernetes
```bash
# Convert Docker Compose to Kubernetes manifests
kompose convert -f docker-compose.yml -o k8s/

# Deploy to cluster
kubectl apply -f k8s/
```

## CI/CD Integration

### GitHub Actions
See `.github/workflows/deploy.yml` for automated deployment.

### GitLab CI
```yaml
deploy:
  image: docker:latest
  script:
    - docker-compose -f docker-compose.yml up -d
```

## Maintenance

### Regular Tasks
```bash
# Weekly: Check logs and alerts
# Monthly: Update images
docker-compose pull && docker-compose up -d

# Quarterly: Clean up old data
docker exec mongodb_container mongorepository.cleanup()

# Annually: Security audit
```

### Updates
```bash
# Update services
docker-compose pull
docker-compose up -d

# Verify health
docker-compose ps
```

## Support & Documentation

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Prometheus Guide](https://prometheus.io/docs/)
- [Grafana Dashboard Guide](https://grafana.com/docs/grafana/latest/dashboards/)

## License

MIT License - See LICENSE file

---

**Need Help?** Create an issue on GitHub or check the main README.md

**Ready to Deploy?** Continue to [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment options.
