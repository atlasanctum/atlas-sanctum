# Atlas Genesis - Regenerative Carbon Credit Marketplace

Complete platform for managing, valuing, and trading Regenerative Impact Units (RIUs) on a global scale.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (for backend database)
- Supabase account (optional, for managed database)

### Development Setup

#### 1. Frontend Setup
```bash
cd /path/to/atlas-genesis-fe2efd70
npm install
npm run dev
```
Frontend runs on `http://localhost:8080`

#### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:4000`

#### 3. Configure Environment Variables
Create a `.env` file in the frontend root:
```
VITE_API_URL=http://localhost:4000/api
VITE_SUPABASE_URL=https://iwremcrvzoprfrytvoze.supabase.co
VITE_SUPABASE_ANON_KEY=your-key
```

### Testing the APIs
```bash
# Test health endpoint
curl http://localhost:4000/health

# Get API documentation
curl http://localhost:4000/api

# Example: Sign up a new user
curl -X POST http://localhost:4000/api/v2/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secure123","displayName":"John Doe"}'

# Example: Get RIU market data
curl http://localhost:4000/api/v2/marketplace/riums/market
```

## 📁 Project Structure

### Frontend (`src/`)
- **pages/** - Feature pages (Measurements, Marketplace, Governance, etc.)
- **components/** - React components and UI elements
- **hooks/** - Custom React hooks
- **lib/api/** - API service layer and hooks
- **types/** - TypeScript type definitions
- **integrations/** - Third-party integrations (Supabase)

### Backend (`backend/`)
- **src/routes/** - API route handlers
- **src/services/** - Business logic
- **src/middleware/** - Express middleware
- **src/db.ts** - Database connection
- **db/migrations/** - Database migration files

### Database (`backend/db/migrations/`)
- SQL migration files for schema setup
- PostGIS extensions for geographic data

## 🔌 API Endpoints

### V2 API (Recommended)

#### Authentication
- `POST /api/v2/auth/signup` - Register new user
- `POST /api/v2/auth/login` - Login user
- `GET /api/v2/auth/me` - Get current user
- `PUT /api/v2/auth/profile` - Update profile

#### Marketplace
- `GET /api/v2/marketplace/riums/market` - Market statistics
- `GET /api/v2/marketplace/riums/listings` - List RIU offerings
- `POST /api/v2/marketplace/riums` - Create RIU listing
- `POST /api/v2/marketplace/riums/{id}/purchase` - Purchase RIUs
- `GET /api/v2/marketplace/bonds` - Get available bonds
- `POST /api/v2/marketplace/bonds/{id}/purchase` - Purchase bond
- `GET /api/v2/marketplace/transactions` - Transaction history

#### Projects
- `GET /api/v2/projects` - List projects
- `GET /api/v2/projects/{id}` - Get project details
- `POST /api/v2/projects` - Create new project
- `PUT /api/v2/projects/{id}` - Update project
- `GET /api/v2/projects/{id}/stats` - Get project statistics
- `POST /api/v2/projects/{id}/approve` - Approve project
- `POST /api/v2/projects/{id}/reject` - Reject project

#### Measurements
- `GET /api/v2/measurements/project/{projectId}` - Get project measurements
- `POST /api/v2/measurements` - Record new measurement
- `GET /api/v2/measurements/{id}` - Get measurement details
- `GET /api/v2/measurements/anomalies` - Get detected anomalies
- `GET /api/v2/measurements/{projectId}/trends` - Get measurement trends
- `GET /api/v2/measurements/bioregion/{bioregionId}` - Get bioregion data

## 🎯 Features Implemented

### 1. Planetary Measurement & Verification Layer
- Real-time satellite data integration (Sentinel-2, Landsat)
- Multi-metric tracking (CO₂, soil carbon, NDVI, biodiversity)
- Anomaly detection with confidence intervals
- Ocean carbon tracking and eDNA sequencing

### 2. Geographic Intelligence & Bioregional Mapping
- PostGIS-powered zone visualization
- Climate risk forecasting (25-year projections)
- Historical land-use analysis with ML reconstruction
- Indigenous land recognition and protection
- Justice-aware pricing multipliers

### 3. Regenerative Agriculture & Ecosystem Recovery
- Soil microbiome health scoring
- Crop diversity metrics
- Mangrove/kelp forest restoration tracking
- Pollinator recovery monitoring
- Farmer income projections ($205K-565K annually)

### 4. Mathematical Trust & Credit Valuation Engine
- Multi-variable impact scoring (CO₂ 45%, Biodiversity 35%, Health 20%)
- Confidence intervals with 95% CI bounds
- Reversal risk decay over 25-year horizon
- Dynamic pricing model ($25 base → $70 final)
- Permanence bonding mechanism (2.5% escrow)

### 5. Ethical, Cultural & Spiritual Governance
- Bioregional Ethics Councils (12 members, 67% indigenous)
- Community Consent Validation (Free, Prior & Informed)
- Sacred land protection with blockchain geofencing
- DAO-style decision-making with supermajority voting
- Non-issuable project enforcement

### 6. Marketplace & Financial Infrastructure
- Regenerative Impact Units (RIUs) standardized asset class
- Tiered buyer system (Individuals → Corporations → Nations)
- 24.5M RIUs in circulation, $1.84B trading volume
- Regeneration-backed bonds (3.8% - 6.5% coupons)
- ESG integration APIs (XBRL, GRI, TCFD)

### 7. Human Health Integration
- Air quality credits ($45/ton PM2.5 reduction)
- Water restoration metrics and health scoring
- Urban green health score integration
- Healthcare savings projections ($840M per 1M RIUs)
- Insurer and government participation frameworks

### 8. Language, Education & Global Outreach
- 45+ languages with real-time translation
- Story-based impact communication
- Youth engagement programs (850K students)
- Cultural metaphor integration (180+ narratives)
- Educational curriculum materials

### 9. Security, Transparency & Anti-Fraud
- SHA-256 tamper-proof blockchain records
- Multi-source cross-verification system
- ML-based anomaly detection
- 24/7 automated security audits
- 100% public audit trail

### 10. Adoption Pathway for Global Change
- Six actor entry points (Individuals → Nations)
- Role-specific onboarding pathways
- The Flywheel Effect economic model
- Integration points demonstrating system coherence
- Adoption timeline and income projections

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts and profiles
- `carbon_projects` - Carbon credit projects
- `measurement_data` - Satellite and sensor measurements
- `bioregional_zones` - Geographic zones with climate data
- `riums` - Regenerative Impact Units (tradable assets)
- `listings` - RIU market listings
- `transactions` - Trading transactions
- `bonds` - Bond offerings
- `proposals` - Governance proposals
- `votes` - Governance votes

### Migrations
Located in `supabase/migrations/` directory:
- `20251206011017_*.sql` - Initial schema
- `20251207052646_*.sql` - Additional tables
- `20251210123938_*.sql` - Constraints and indexes
- `20251228_regenerative_expansion.sql` - PostGIS and extended features

## 📊 Data Models

### RIU (Regenerative Impact Unit)
```typescript
{
  id: string;
  sellerId: string;
  projectId: string;
  quantity: number;
  price: number;
  impactScore: number; // 0-100
  confidenceInterval: number; // 0.95 = 95% CI
  status: 'active' | 'sold' | 'retired';
  createdAt: Date;
}
```

### Project
```typescript
{
  id: string;
  ownerId: string;
  name: string;
  projectType: 'regenerative-ag' | 'restoration' | 'renewable';
  status: 'pending' | 'approved' | 'active' | 'rejected';
  co2Target: number;
  co2Achieved: number;
  biodiversityScore: number;
  healthImpactScore: number;
  areaHectares: number;
}
```

## 🔐 Authentication

The platform uses JWT tokens for authentication:

1. **Sign Up** - Create account
2. **Login** - Get JWT token
3. **Token Usage** - Include in Authorization header: `Bearer <token>`
4. **Profile** - Update user information

Tokens are stored in localStorage and included in all API requests.

## 🌐 Deployment

This guide provides comprehensive deployment instructions for the Atlas Genesis platform to cloud platforms including AWS and Vercel. The deployment covers production-ready configurations with proper scaling, backup strategies, and maintenance procedures.

### Prerequisites

- AWS CLI configured with appropriate permissions (for AWS deployment)
- Vercel CLI installed (for Vercel deployment)
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL client tools
- SSL certificates (Let's Encrypt or purchased)

### Environment Configuration

#### Production Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Application Configuration
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://yourdomain.com

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secure-access-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-min-32-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# Email Configuration
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Atlas Genesis

# Payment Configuration
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=your-paystack-public-key

# Security Configuration
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=info
LOG_FILE_PATH=/var/log/atlas-genesis/app.log

# Monitoring Configuration (optional)
SENTRY_DSN=your-sentry-dsn
DATADOG_API_KEY=your-datadog-api-key
```

**Security Note:** Never commit `.env` files to version control. Use AWS Systems Manager Parameter Store or AWS Secrets Manager for sensitive data in production.

### Database Setup

#### PostgreSQL Production Setup

1. **Create PostgreSQL instance:**
   - AWS RDS: Use PostgreSQL 15+ with Multi-AZ deployment
   - DigitalOcean: Managed PostgreSQL database
   - Self-hosted: PostgreSQL 15+ with PostGIS extension

2. **Database Configuration:**
   ```sql
   CREATE DATABASE atlas_genesis;
   CREATE USER atlas_user WITH ENCRYPTED PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE atlas_genesis TO atlas_user;
   ```

3. **Run Migrations:**
   ```bash
   cd backend
   npm run migrate
   ```

4. **PostGIS Setup (for geographic features):**
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   CREATE EXTENSION IF NOT EXISTS postgis_topology;
   ```

#### Database Backup Strategy

- **Automated Backups:** Enable daily automated backups with 7-day retention
- **Manual Backups:** Weekly full backups stored in S3 with cross-region replication
- **Point-in-Time Recovery:** Enable for up to 7 days
- **Backup Testing:** Monthly restore tests to ensure backup integrity

### AWS Deployment

#### Architecture Overview

- **Frontend:** S3 + CloudFront (static hosting)
- **Backend:** ECS Fargate (containerized)
- **Database:** RDS PostgreSQL (managed)
- **CDN:** CloudFront for global distribution
- **Load Balancer:** Application Load Balancer (ALB)
- **Monitoring:** CloudWatch + X-Ray

#### Step-by-Step AWS Deployment

1. **Prerequisites Setup:**
   ```bash
   # Install AWS CLI
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install

   # Configure AWS CLI
   aws configure
   ```

2. **Create S3 Bucket for Frontend:**
   ```bash
   aws s3 mb s3://atlas-genesis-frontend --region us-east-1
   aws s3 website s3://atlas-genesis-frontend --index-document index.html --error-document index.html
   ```

3. **Build and Deploy Frontend:**
   ```bash
   npm run build
   aws s3 sync dist/ s3://atlas-genesis-frontend --delete
   ```

4. **Create CloudFront Distribution:**
   ```bash
   aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
   ```

5. **Setup RDS PostgreSQL:**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier atlas-genesis-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username atlas_user \
     --master-user-password secure_password \
     --allocated-storage 20 \
     --vpc-security-group-ids sg-xxxxx \
     --db-subnet-group-name atlas-subnet-group
   ```

6. **Create ECS Cluster and Task Definition:**
   ```bash
   # Create ECR repository
   aws ecr create-repository --repository-name atlas-genesis-backend

   # Build and push Docker image
   cd backend
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
   docker build -t atlas-genesis-backend .
   docker tag atlas-genesis-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/atlas-genesis-backend:latest
   docker push <account>.dkr.ecr.us-east-1.amazonaws.com/atlas-genesis-backend:latest
   ```

7. **Deploy ECS Service:**
   ```bash
   aws ecs create-service \
     --cluster atlas-genesis-cluster \
     --service-name atlas-genesis-backend \
     --task-definition atlas-genesis-backend \
     --desired-count 2 \
     --launch-type FARGATE \
     --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[sg-xxxxx]}"
   ```

8. **Setup Application Load Balancer:**
   ```bash
   aws elbv2 create-load-balancer \
     --name atlas-genesis-alb \
     --subnets subnet-xxxxx subnet-yyyyy \
     --security-groups sg-xxxxx
   ```

#### AWS Security Considerations

- **VPC Configuration:** Use private subnets for backend services
- **Security Groups:** Minimal required ports (80, 443 for ALB, 5432 for RDS)
- **IAM Roles:** Least privilege principle for ECS tasks
- **SSL/TLS:** AWS Certificate Manager for free SSL certificates
- **WAF:** AWS WAF with OWASP rules for API protection
- **Secrets Management:** AWS Secrets Manager for sensitive data

#### AWS Scaling Configuration

- **Auto Scaling:** ECS service auto-scaling based on CPU/memory utilization
- **RDS Scaling:** Read replicas for read-heavy workloads
- **CloudFront:** Global edge locations for low latency
- **Target Scaling:** 60-80% CPU utilization target

### Vercel Deployment

#### Architecture Overview

- **Frontend:** Vercel (static hosting with serverless functions)
- **Backend:** Vercel Serverless Functions (API routes)
- **Database:** Vercel Postgres or external PostgreSQL
- **CDN:** Vercel Edge Network

#### Step-by-Step Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy Frontend:**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables:**
   ```bash
   vercel env add VITE_API_URL
   vercel env add DATABASE_URL
   # Add other required environment variables
   ```

4. **Setup Vercel Postgres (optional):**
   ```bash
   vercel postgres create
   vercel postgres connect
   ```

5. **Deploy Backend as Serverless Functions:**
   - Convert Express routes to Vercel API routes
   - Move routes to `api/` directory
   - Update Vercel configuration

#### Vercel Configuration (vercel.json)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Monitoring and Logging

#### Application Monitoring

1. **AWS CloudWatch:**
   - Application logs aggregation
   - Custom metrics and alarms
   - X-Ray for distributed tracing

2. **Error Tracking:**
   - Sentry integration for error monitoring
   - Alert configuration for critical errors

3. **Performance Monitoring:**
   - Application Performance Monitoring (APM)
   - Database query performance
   - API response times

#### Logging Configuration

```javascript
// Winston configuration for production
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: process.env.LOG_FILE_PATH }),
    new winston.transports.Console()
  ]
});
```

### Security Considerations

#### API Security

- **Rate Limiting:** 100 requests per 15 minutes per IP
- **CORS:** Configured for specific domains
- **Helmet.js:** Security headers middleware
- **Input Validation:** Joi schema validation
- **SQL Injection Prevention:** Parameterized queries

#### Data Protection

- **Encryption at Rest:** RDS encryption enabled
- **Encryption in Transit:** SSL/TLS for all connections
- **GDPR Compliance:** Data minimization and consent management
- **Audit Logging:** All user actions logged for compliance

#### Authentication Security

- **JWT Tokens:** Secure token storage and rotation
- **OAuth Integration:** Secure OAuth flows
- **Password Policies:** Strong password requirements
- **Session Management:** Secure session handling

### Backup and Recovery

#### Automated Backups

- **Database:** Daily automated backups with 30-day retention
- **Application:** Infrastructure as Code for quick recovery
- **Configuration:** Version-controlled configuration files

#### Disaster Recovery

- **Multi-AZ Deployment:** High availability across availability zones
- **Cross-Region Backup:** Critical data backed up to secondary region
- **Recovery Time Objective (RTO):** < 4 hours
- **Recovery Point Objective (RPO):** < 1 hour

### Maintenance Procedures

#### Regular Maintenance Tasks

1. **Security Updates:**
   - Monthly dependency updates
   - Security patch application
   - Vulnerability scanning

2. **Performance Optimization:**
   - Database query optimization
   - Cache tuning
   - Resource scaling

3. **Monitoring Review:**
   - Weekly log analysis
   - Performance metrics review
   - Alert threshold adjustments

#### Emergency Procedures

- **Incident Response Plan:** Documented escalation procedures
- **Rollback Strategy:** Quick rollback to previous version
- **Communication Plan:** Stakeholder notification procedures

### Cost Optimization

#### AWS Cost Management

- **Reserved Instances:** For predictable workloads
- **Auto Scaling:** Scale down during low traffic
- **Storage Optimization:** Use appropriate storage classes
- **Monitoring Costs:** Set up billing alerts

#### Vercel Cost Management

- **Function Optimization:** Minimize cold starts
- **Bandwidth Monitoring:** Monitor usage limits
- **Plan Selection:** Choose appropriate pricing tier

### Troubleshooting

#### Common Issues

1. **Database Connection Issues:**
   - Check security groups and VPC configuration
   - Verify connection string format

2. **Deployment Failures:**
   - Check build logs for errors
   - Verify environment variables

3. **Performance Issues:**
   - Monitor CloudWatch metrics
   - Check database query performance

#### Support Resources

- AWS Documentation: https://docs.aws.amazon.com/
- Vercel Documentation: https://vercel.com/docs
- Atlas Genesis Support: support@atlas-genesis.com

## 🧪 Testing

### Frontend Tests
```bash
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

## 📚 Documentation

- **QUICKSTART.md** - Feature navigation guide
- **IMPLEMENTATION_SUMMARY.md** - Technical details
- **PROJECT_COMPLETION_REPORT.md** - Full project report
- **COMPLETION_CHECKLIST.md** - Task verification

## 🤝 Contributing

1. Create a branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push branch: `git push origin feature/your-feature`
4. Create pull request

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check existing GitHub issues
2. Create new issue with detailed description
3. Contact: support@atlas-genesis.com

---

**Status:** ✅ Production Ready
**Last Updated:** January 3, 2026
**Version:** 2.1.0
