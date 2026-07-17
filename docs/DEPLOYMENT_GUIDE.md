# Deployment Guide — Hospital CRM

## Production Deployment Steps

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed
- [ ] Environment variables configured
- [ ] Database backups taken
- [ ] SSL certificates ready
- [ ] Domain DNS configured
- [ ] Monitoring setup
- [ ] Error tracking configured
- [ ] Rate limiting configured
- [ ] Logging system ready

### Backend Deployment

#### Step 1: Prepare Environment
```bash
# Create production .env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/hospital_crm
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
CLIENT_URL=https://hospital-crm.com
```

#### Step 2: Build Application
```bash
cd backend
npm install --production
npm run build  # if applicable
```

#### Step 3: Run Server
```bash
npm start
```

### Frontend Deployment

#### Step 1: Build for Production
```bash
cd frontend
npm install --legacy-peer-deps
npm run build
```

#### Step 2: Deploy Build Output
- Copy `dist/` folder to web server
- Configure routing for SPA
- Setup cache headers

#### Step 3: Configure Web Server
```nginx
server {
    listen 443 ssl;
    server_name hospital-crm.com;
    
    root /var/www/hospital-crm/dist;
    index index.html;
    
    # SPA routing
    location / {
        try_files $uri /index.html;
    }
    
    # API proxy
    location /api {
        proxy_pass http://backend:5000;
    }
}
```

### Docker Deployment

#### Backend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/hospital_crm
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo
      
  frontend:
    build: ./frontend
    ports:
      - "80:80"
      
  mongo:
    image: mongo:latest
    volumes:
      - mongo_data:/data/db
      
volumes:
  mongo_data:
```

### Cloud Deployment Options

#### Railway (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy with one click

#### Vercel (Frontend)
1. Import project
2. Configure build settings
3. Deploy

#### AWS EC2
1. Launch Ubuntu instance
2. Install Node.js and MongoDB
3. Deploy application
4. Configure security groups

### SSL/TLS Setup

```bash
# Using Let's Encrypt with Nginx
sudo certbot certonly --standalone -d hospital-crm.com
sudo certbot renew --dry-run
```

### Monitoring & Maintenance

#### Health Checks
```bash
curl https://hospital-crm.com/api/health
```

#### Log Monitoring
```bash
# View application logs
tail -f /var/log/hospital-crm/app.log

# View error logs
tail -f /var/log/hospital-crm/error.log
```

#### Database Backup
```bash
# Automated daily backup
0 2 * * * mongodump --uri "mongodb://..." --archive=/backups/hospital-crm-$(date +\%Y\%m\%d).archive
```

### Performance Optimization

- Enable gzip compression
- Setup CDN for static assets
- Configure database indexes
- Implement caching
- Setup rate limiting
- Monitor resource usage
