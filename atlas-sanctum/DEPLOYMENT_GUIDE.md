# Atlas Sanctum MVP - Deployment Guide

## Overview

This guide covers deploying the Atlas Sanctum MVP backend API to production.

---

## Prerequisites

### System Requirements

- **OS**: Ubuntu 20.04+ / macOS 12+ / Windows 10+ with WSL2
- **Node.js**: 18.x or higher
- **PostgreSQL**: 14.x or higher with PostGIS extension
- **Redis**: 6.x or higher (for background jobs)
- **Storage**: S3-compatible object storage (optional)

### Software Installation

#### Ubuntu/Debian

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL with PostGIS
sudo apt install -y postgresql postgresql-contrib postgis

# Install Redis
sudo apt install -y redis-server

# Install build essentials
sudo apt install -y build-essential git
```

#### macOS

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@18

# Install PostgreSQL with PostGIS
brew install postgresql postgis

# Install Redis
brew install redis

# Start services
brew services start postgresql
brew services start redis
```

---

## Database Setup

### 1. Create Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE atlas_sanctum;

# Create user (optional)
CREATE USER atlas_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE atlas_sanctum TO atlas_user;

# Enable PostGIS extension
\c atlas_sanctum
CREATE EXTENSION IF NOT EXISTS postgis;

# Exit
\q
```

### 2. Run Migrations

```bash
cd atlas-sanctum/backend

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env

# Run migrations
npm run migrate
```

### 3. Seed Database

```bash
# Seed with initial data
npm run seed
```

---

## Environment Configuration

### Production Environment Variables

Create a `.env` file with production values:

```bash
# Server
PORT=3000
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=atlas_sanctum
DB_USER=atlas_user
DB_PASSWORD=your_secure_password_here

# JWT (generate strong secrets)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS (restrict to your domain)
CORS_ORIGIN=https://your-domain.com

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Object Storage (if using S3)
S3_ENDPOINT=https://s3.amazonaws.com
S3_ACCESS_KEY=your_access_key
S3_SECRET_KEY=your_secret_key
S3_BUCKET=atlas-sanctum-prod
S3_REGION=us-east-1

# Logging
LOG_LEVEL=info

# Email (for notifications)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
SMTP_FROM=noreply@your-domain.com
```

### Generate Secure Secrets

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate Redis password
openssl rand -base64 24
```

---

## Build & Deploy

### 1. Install Dependencies

```bash
cd atlas-sanctum/backend
npm install --production
```

### 2. Build TypeScript

```bash
npm run build
```

### 3. Start Application

#### Development

```bash
npm run dev
```

#### Production with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start dist/app.js --name atlas-sanctum-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Production with systemd

Create `/etc/systemd/system/atlas-sanctum.service`:

```ini
[Unit]
Description=Atlas Sanctum API
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=atlas
WorkingDirectory=/opt/atlas-sanctum/backend
ExecStart=/usr/bin/node dist/app.js
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

# Environment
Environment=NODE_ENV=production
EnvironmentFile=/opt/atlas-sanctum/backend/.env

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=/opt/atlas-sanctum/backend

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable atlas-sanctum
sudo systemctl start atlas-sanctum
sudo systemctl status atlas-sanctum
```

---

## Reverse Proxy (Nginx)

### Install Nginx

```bash
sudo apt install -y nginx
```

### Configure Nginx

Create `/etc/nginx/sites-available/atlas-sanctum`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API proxy
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/atlas-sanctum /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## Database Backup & Restore

### Backup

```bash
# Full database backup
pg_dump -U atlas_user -d atlas_sanctum > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump -U atlas_user -d atlas_sanctum | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Restore

```bash
# Restore from backup
psql -U atlas_user -d atlas_sanctum < backup_file.sql

# Restore from compressed backup
gunzip -c backup_file.sql.gz | psql -U atlas_user -d atlas_sanctum
```

### Automated Backups

Create backup script `/opt/atlas-sanctum/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/opt/atlas-sanctum/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/atlas_sanctum_$DATE.sql.gz"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform backup
pg_dump -U atlas_user -d atlas_sanctum | gzip > $BACKUP_FILE

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE"
```

Add to crontab:

```bash
chmod +x /opt/atlas-sanctum/backup.sh
crontab -e
# Add: 0 2 * * * /opt/atlas-sanctum/backup.sh
```

---

## Monitoring

### Application Logs

```bash
# View PM2 logs
pm2 logs atlas-sanctum-api

# View systemd logs
sudo journalctl -u atlas-sanctum -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Health Checks

```bash
# Check API health
curl http://localhost:3000/health

# Expected response:
# {"status":"healthy","timestamp":"2026-03-23T17:53:47.050Z","service":"atlas-sanctum-api"}
```

### Performance Monitoring

Install monitoring tools:

```bash
# Install htop
sudo apt install -y htop

# Monitor system resources
htop

# Monitor database connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
```

---

## Security Hardening

### 1. Firewall Configuration

```bash
# Install UFW
sudo apt install -y ufw

# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 2. Database Security

```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Change local connections to md5
local   all             all                                     md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### 3. Application Security

- Use strong JWT secrets (min 32 characters)
- Enable CORS only for trusted domains
- Use HTTPS in production
- Regularly update dependencies
- Monitor audit logs

---

## Scaling

### Horizontal Scaling

1. **Load Balancer**: Use Nginx or HAProxy
2. **Multiple Instances**: Run multiple API instances
3. **Database Replication**: Set up PostgreSQL read replicas
4. **Redis Cluster**: Use Redis Sentinel or Cluster

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database queries
- Add database indexes
- Enable connection pooling

---

## Troubleshooting

### Common Issues

#### Database Connection Failed

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check database exists
sudo -u postgres psql -l

# Test connection
psql -U atlas_user -d atlas_sanctum -h localhost
```

#### Application Won't Start

```bash
# Check logs
pm2 logs atlas-sanctum-api

# Check port availability
sudo lsof -i :3000

# Check environment variables
cat .env
```

#### High Memory Usage

```bash
# Check memory usage
free -h

# Restart application
pm2 restart atlas-sanctum-api

# Check for memory leaks
node --inspect dist/app.js
```

---

## Maintenance

### Regular Tasks

1. **Daily**: Check application logs
2. **Weekly**: Review audit logs
3. **Monthly**: Update dependencies
4. **Quarterly**: Security audit

### Update Procedure

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build application
npm run build

# Restart application
pm2 restart atlas-sanctum-api

# Verify health
curl http://localhost:3000/health
```

---

## Support

For issues or questions:
1. Check logs for error messages
2. Review this deployment guide
3. Consult the main README.md
4. Contact the Atlas Humanitarian team

---

**Atlas Sanctum MVP** - Production deployment guide for humanitarian impact.
