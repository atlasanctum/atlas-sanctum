#!/bin/bash

# Production Deployment Script for EthosDAO Collective Workspace
# Usage: ./scripts/deploy-production.sh [environment]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
BUILD_DIR="dist"
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

echo -e "${GREEN}🚀 Starting EthosDAO Production Deployment${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo ""

# Step 1: Pre-deployment checks
echo -e "${GREEN}Step 1: Running pre-deployment checks...${NC}"

# Check if .env file exists
if [ ! -f ".env.${ENVIRONMENT}" ]; then
    echo -e "${RED}❌ Error: .env.${ENVIRONMENT} not found${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Error: Node.js 18+ required (current: $(node -v))${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pre-deployment checks passed${NC}"
echo ""

# Step 2: Run tests
echo -e "${GREEN}Step 2: Running tests...${NC}"
npm test || {
    echo -e "${RED}❌ Tests failed. Deployment aborted.${NC}"
    exit 1
}
echo -e "${GREEN}✅ All tests passed${NC}"
echo ""

# Step 3: Security audit
echo -e "${GREEN}Step 3: Running security audit...${NC}"
npm audit --audit-level=high || {
    echo -e "${YELLOW}⚠️  Security vulnerabilities found. Review before continuing.${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
}
echo -e "${GREEN}✅ Security audit complete${NC}"
echo ""

# Step 4: Create backup
echo -e "${GREEN}Step 4: Creating backup...${NC}"
if [ -d "$BUILD_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    cp -r "$BUILD_DIR" "$BACKUP_DIR/"
    echo -e "${GREEN}✅ Backup created at ${BACKUP_DIR}${NC}"
else
    echo -e "${YELLOW}⚠️  No existing build to backup${NC}"
fi
echo ""

# Step 5: Install dependencies
echo -e "${GREEN}Step 5: Installing dependencies...${NC}"
if command -v pnpm &> /dev/null; then
    pnpm install --frozen-lockfile
else
    npm ci
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 6: Build application
echo -e "${GREEN}Step 6: Building application...${NC}"
export NODE_ENV=production
npm run build || {
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Build completed successfully${NC}"
echo ""

# Step 7: Run post-build checks
echo -e "${GREEN}Step 7: Running post-build checks...${NC}"

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Build directory not found${NC}"
    exit 1
fi

# Check if main files exist
if [ ! -f "$BUILD_DIR/index.html" ]; then
    echo -e "${RED}❌ index.html not found in build${NC}"
    exit 1
fi

# Check build size
BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
echo -e "${GREEN}📦 Build size: ${BUILD_SIZE}${NC}"

echo -e "${GREEN}✅ Post-build checks passed${NC}"
echo ""

# Step 8: Database migrations (if needed)
echo -e "${GREEN}Step 8: Running database migrations...${NC}"
if [ -f "scripts/migrate.sh" ]; then
    ./scripts/migrate.sh $ENVIRONMENT || {
        echo -e "${RED}❌ Database migration failed${NC}"
        exit 1
    }
    echo -e "${GREEN}✅ Database migrations complete${NC}"
else
    echo -e "${YELLOW}⚠️  No migration script found, skipping${NC}"
fi
echo ""

# Step 9: Deploy based on environment
echo -e "${GREEN}Step 9: Deploying to ${ENVIRONMENT}...${NC}"

case $ENVIRONMENT in
    production)
        # Deploy to production server
        echo -e "${YELLOW}Deploying to production server...${NC}"
        
        # Option 1: Vercel
        if command -v vercel &> /dev/null; then
            vercel --prod --yes
        # Option 2: Docker
        elif command -v docker &> /dev/null; then
            docker-compose -f docker-compose.yml up -d --build
        # Option 3: Manual deployment
        else
            echo -e "${YELLOW}Manual deployment required${NC}"
            echo -e "Copy ${BUILD_DIR} to your production server"
        fi
        ;;
    
    staging)
        # Deploy to staging server
        echo -e "${YELLOW}Deploying to staging server...${NC}"
        if command -v vercel &> /dev/null; then
            vercel --yes
        fi
        ;;
    
    *)
        echo -e "${RED}❌ Unknown environment: ${ENVIRONMENT}${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}✅ Deployment complete${NC}"
echo ""

# Step 10: Post-deployment verification
echo -e "${GREEN}Step 10: Running post-deployment verification...${NC}"

# Wait for application to start
echo -e "${YELLOW}Waiting for application to start...${NC}"
sleep 10

# Health check
if command -v curl &> /dev/null; then
    HEALTH_URL="https://ethosdao.com/health"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ Health check passed (HTTP $HTTP_CODE)${NC}"
    else
        echo -e "${RED}❌ Health check failed (HTTP $HTTP_CODE)${NC}"
        echo -e "${YELLOW}Consider rolling back the deployment${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  curl not found, skipping health check${NC}"
fi

echo ""

# Step 11: Clear cache
echo -e "${GREEN}Step 11: Clearing cache...${NC}"
if command -v redis-cli &> /dev/null; then
    redis-cli FLUSHDB
    echo -e "${GREEN}✅ Cache cleared${NC}"
else
    echo -e "${YELLOW}⚠️  Redis not found, skipping cache clear${NC}"
fi
echo ""

# Step 12: Send notifications
echo -e "${GREEN}Step 12: Sending deployment notifications...${NC}"
DEPLOYMENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')
DEPLOYMENT_MSG="🚀 EthosDAO deployed to ${ENVIRONMENT} at ${DEPLOYMENT_TIME}"

# Send to Slack (if webhook configured)
if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"${DEPLOYMENT_MSG}\"}" \
        $SLACK_WEBHOOK_URL
fi

echo -e "${GREEN}✅ Notifications sent${NC}"
echo ""

# Summary
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "Environment: ${ENVIRONMENT}"
echo -e "Build size: ${BUILD_SIZE}"
echo -e "Deployment time: ${DEPLOYMENT_TIME}"
echo -e "Backup location: ${BACKUP_DIR}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Monitor application logs"
echo -e "2. Check error tracking dashboard"
echo -e "3. Verify key functionality"
echo -e "4. Monitor performance metrics"
echo ""
echo -e "${GREEN}Happy deploying! 🎉${NC}"
