# Docker Deployment Guide — Phase 14 T-208, T-209, T-210

## Overview

Hospital CRM is containerized for production deployment using Docker and Docker Compose. This includes:
- Multi-stage builds for optimized image sizes
- Non-root user execution for security
- Health checks for reliability
- Redis caching service
- MongoDB database
- Nginx reverse proxy (optional)

---

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

**Install Docker:**
- Windows: https://docs.docker.com/desktop/install/windows-install/
- Mac: https://docs.docker.com/desktop/install/mac-install/
- Linux: https://docs.docker.com/engine/install/

---

## Quick Start (Local Development)

### 1. Clone Repository
```bash
git clone https://github.com/vedantkulkarniii/Hospital-CRM.git
cd Hospital-CRM
```

### 2. Create Environment File
```bash
cp .env.production.example .env.production
# Edit .env.production with your values
nano .env.production
```

### 3. Start Services
```bash
docker-compose up -d
```

### 4. Verify Services
```bash
docker-compose ps
docker-compose logs -f
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

---

## Docker Images

### Backend Image

**Dockerfile**: `backend/Dockerfile`

**Features:**
- Node.js 18 Alpine (slim image)
- Multi-stage build
- Non-root user (nodejs:1001)
- dumb-init for proper signal handling
- Health check enabled
- Production optimized

**Build Command:**
```bash
docker build -t hospital-crm-backend:latest ./backend
```

**Run Command:**
```bash
docker run -d \
  -p 5000:5000 \
  -e MONGO_URI=mongodb://localhost:27017/hospital_crm \
  -e REDIS_HOST=redis \
  -e JWT_SECRET=your-secret \
  --name hospital-backend \
  hospital-crm-backend:latest
```

---

### Frontend Image

**Dockerfile**: `frontend/Dockerfile`

**Features:**
- Node.js 18 Alpine (build stage)
- Nginx Alpine (runtime)
- Multi-stage build (optimized size)
- Non-root user
- Gzip compression
- Security headers
- SPA routing configured
- Health check enabled

**Build Command:**
```bash
docker build -t hospital-crm-frontend:latest ./frontend
```

**Run Command:**
```bash
docker run -d \
  -p 3000:3000 \
  -e VITE_API_URL=http://localhost:5000/api \
  --name hospital-frontend \
  hospital-crm-frontend:latest
```

---

## Docker Compose

### Services Included

1. **MongoDB** (mongo:7.0-alpine)
   - Port: 27017
   - Volume: mongodb_data, mongodb_config
   - Health checks enabled

2. **Redis** (redis:7-alpine)
   - Port: 6379
   - Volume: redis_data
   - Health checks enabled

3. **Backend** (custom image)
   - Port: 5000
   - Depends on: MongoDB, Redis
   - Health checks enabled

4. **Frontend** (custom image)
   - Port: 3000
   - Depends on: Backend
   - Health checks enabled

5. **Nginx** (nginx:alpine)
   - Port: 80, 443
   - Reverse proxy for production
   - Profile: production (optional)

---

## Environment Variables

### Required Variables

```bash
# Database
MONGO_URI=mongodb://admin:password@mongodb:27017/hospital_crm?authSource=admin

# Cache
REDIS_HOST=redis
REDIS_PORT=6379

# Authentication
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend
CLIENT_URL=http://localhost:3000
```

### Optional Variables

```bash
# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=200

# Security
CORS_ORIGINS=http://localhost:3000
```

---

## Common Commands

### View Running Containers
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Stop Services
```bash
docker-compose stop
```

### Restart Services
```bash
docker-compose restart
```

### Remove Services
```bash
docker-compose down
```

### Remove Services + Volumes (Clean)
```bash
docker-compose down -v
```

### Execute Command in Container
```bash
# Backend
docker-compose exec backend npm run seed

# Frontend
docker-compose exec frontend npm run build
```

---

## Image Sizes

**Optimized for Production:**

- Backend Image: ~150-200 MB
  - Node.js 18 Alpine: ~150 MB
  - node_modules: ~50 MB
  - App code: <1 MB

- Frontend Image: ~100-150 MB
  - Nginx Alpine: ~30 MB
  - Built assets: ~300 KB (compressed)

**Total docker-compose size: ~500-700 MB**

---

## Health Checks

All services have health checks configured:

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```

Expected Response (200 OK):
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2026-07-18T..."
  }
}
```

### Frontend Health Check
```bash
curl http://localhost:3000/health
```

Expected Response (200 OK):
```
healthy
```

### Database Health Check
```bash
docker-compose exec mongodb mongosh localhost:27017/admin --eval "db.adminCommand('ping')"
```

### Redis Health Check
```bash
docker-compose exec redis redis-cli ping
```

---

## Production Deployment

### 1. Build and Push to Registry

```bash
# Build images
docker build -t yourusername/hospital-crm-backend:1.0.0 ./backend
docker build -t yourusername/hospital-crm-frontend:1.0.0 ./frontend

# Login to Docker Hub
docker login

# Push images
docker push yourusername/hospital-crm-backend:1.0.0
docker push yourusername/hospital-crm-frontend:1.0.0
```

### 2. Deploy to Server

```bash
# SSH to server
ssh user@your-server.com

# Clone repository
git clone https://github.com/vedantkulkarniii/Hospital-CRM.git
cd Hospital-CRM

# Create production environment
cp .env.production.example .env.production
# Edit with production values
nano .env.production

# Start services
docker-compose -f docker-compose.yml up -d
```

### 3. Configure Nginx (If using)

```bash
# Enable Nginx service
docker-compose --profile production up -d nginx

# Configure SSL certificates
# Copy SSL certs to ./ssl/
cp /path/to/cert.pem ./ssl/cert.pem
cp /path/to/key.pem ./ssl/key.pem
```

### 4. Verify Deployment

```bash
docker-compose ps
docker-compose logs -f
curl https://yourdomain.com/health
```

---

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Check configuration
docker-compose config

# Rebuild image
docker-compose build --no-cache backend
```

### Health Check Failing
```bash
# Check service logs
docker-compose logs backend

# Test health endpoint
docker-compose exec backend curl http://localhost:5000/api/health

# Increase start_period if needed (in docker-compose.yml)
```

### Out of Memory
```bash
# Check resource usage
docker stats

# Increase Docker memory limit
# (Docker Desktop Settings → Resources)
```

### Port Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port in docker-compose.yml
```

---

## Security Best Practices

✅ **Implemented:**
- Non-root user execution
- Health checks for reliability
- Minimal base images (Alpine)
- Multi-stage builds
- Environment variable separation
- Volume mounting for logs

⚠️ **Additional for Production:**
- Use private Docker registry
- Scan images for vulnerabilities
- Enable Docker content trust
- Use secrets management (Docker Secrets)
- Implement network policies
- Regular security updates
- SSL/TLS certificates
- Rate limiting at reverse proxy

---

## Performance Optimization

### Image Size Optimization
- Alpine base images
- Multi-stage builds
- .dockerignore files
- Remove unnecessary dependencies

### Runtime Optimization
- CPU limits in docker-compose
- Memory limits in docker-compose
- Volume mounts for database
- Redis caching enabled

### Network Optimization
- Docker bridge network
- Service discovery via names
- Health check intervals

---

## Monitoring & Logging

### View Logs
```bash
# Real-time logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f backend
```

### Container Stats
```bash
docker stats
```

### Inspect Container
```bash
docker-compose exec backend sh
```

---

## References

- Docker Docs: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- Best Practices: https://docs.docker.com/develop/dev-best-practices/
- Security: https://docs.docker.com/engine/security/

---

**Last Updated**: July 18, 2026
**Phase**: 14 — Deployment (T-208, T-209, T-210)
**Status**: ✅ Docker setup complete, ready for deployment
