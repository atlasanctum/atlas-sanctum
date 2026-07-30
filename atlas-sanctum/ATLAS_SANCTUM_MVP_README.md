# Atlas Sanctum MVP

**Atlas can sense fragility, simulate decisions, verify restoration, and help institutions act.**

Atlas Sanctum MVP is the smallest credible system with strategic power - enabling government, NGO, development finance institution, or mission-driven operators to ingest multi-source socio-economic and ecological data, detect regional/system fragility, simulate policy or investment interventions, verify restoration or impact projects, and coordinate decisions through a command center.

---

## 🎯 MVP Objective

Enable operators to:
- **Ingest** multi-source socio-economic and ecological data
- **Detect** regional/system fragility
- **Simulate** policy or investment interventions
- **Verify** restoration or impact projects
- **Coordinate** decisions through a command center

---

## 🏗️ Architecture

### Product Modules

1. **Data Foundation** - Unified ingestion, storage, identity resolution, and geospatial normalization
2. **Fragility Intelligence Engine** - Scores regions across economic, ecological, social, and institutional risk
3. **Policy Sandbox** - Lets operators test interventions and compare likely outcomes
4. **Restoration MRV** - Tracks projects, outcomes, evidence, and verification status
5. **Command Center** - Decision dashboard for executives, analysts, and field operators

### User Roles

1. **Super Admin** - Platform config, org management, permissions, model governance
2. **Analyst** - Uploads data, builds indicators, runs scenarios, reviews outputs
3. **Decision Maker** - Consumes dashboards, compares options, approves actions
4. **Field Verifier** - Submits evidence, observations, photos, forms, field audits
5. **External Partner** - Limited access to project, restoration, or reporting views

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ with PostGIS extension
- Redis (for background jobs)
- S3-compatible storage (optional)

### Installation

```bash
# Clone the repository
cd atlas-sanctum/backend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env with your database credentials
nano .env

# Run database migrations
npm run migrate

# Seed the database
npm run seed

# Start development server
npm run dev
```

### Database Setup

```sql
-- Create database
CREATE DATABASE atlas_sanctum;

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Run migrations
\i db/migrations/003_atlas_sanctum_mvp.sql
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/v1
```

### Authentication

All API endpoints require JWT authentication except `/v1/auth/login` and `/v1/auth/register`.

```bash
# Login
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@atlas.org", "password": "password123"}'

# Use token in subsequent requests
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/v1/me
```

### Core Endpoints

#### Auth & Organizations
- `POST /v1/auth/login` - Authenticate user
- `POST /v1/auth/register` - Register new user
- `POST /v1/auth/refresh` - Refresh access token
- `GET /v1/me` - Get current user
- `GET /v1/organizations/:id` - Get organization profile

#### Data Sources & Ingestion
- `POST /v1/data-sources` - Register data source
- `GET /v1/data-sources` - List data sources
- `POST /v1/data-sources/:id/uploads` - Upload file
- `GET /v1/ingestion-jobs/:job_id` - Get ingestion job status
- `POST /v1/observations/bulk` - Insert normalized observations

#### Regions & Geospatial
- `GET /v1/regions` - List regions
- `GET /v1/regions/:id` - Get region profile with indicators

#### Indicators
- `POST /v1/indicators` - Create indicator definition
- `GET /v1/indicators` - List indicator catalog
- `GET /v1/regions/:id/indicators` - Get region indicator values

#### Fragility Engine
- `POST /v1/fragility/runs` - Trigger scoring run
- `GET /v1/fragility/runs/:run_id` - Get scoring job status
- `GET /v1/fragility/scores` - List fragility scores
- `GET /v1/fragility/regions/:region_id/drivers` - Get top drivers
- `POST /v1/alerts/rules` - Create alert rule

#### Policy Sandbox
- `POST /v1/scenarios` - Create scenario
- `GET /v1/scenarios` - List scenarios
- `POST /v1/scenarios/:id/run` - Execute simulation
- `GET /v1/scenarios/:id/results` - Get scenario outputs
- `POST /v1/scenarios/:id/approve` - Approve scenario

#### Restoration MRV
- `POST /v1/projects` - Create project
- `GET /v1/projects` - List projects
- `POST /v1/projects/:id/sites` - Attach project site
- `POST /v1/projects/:id/evidence` - Submit evidence
- `POST /v1/projects/:id/verify` - Verify project

#### Command Center
- `GET /v1/dashboard/overview` - Get command center summary
- `GET /v1/dashboard/hotspots` - Get ranked hotspots
- `POST /v1/actions` - Create action record
- `GET /v1/actions` - List actions
- `PATCH /v1/actions/:id` - Update action status

---

## 🗄️ Database Schema

### Core Tables

- **organizations** - Organization profiles
- **users** - User accounts with roles
- **regions** - Geographic regions with PostGIS geometry
- **data_sources** - Registered data sources
- **ingestion_jobs** - File upload and processing jobs
- **indicators** - Indicator definitions
- **observations** - Time-series indicator values
- **model_versions** - ML model versions
- **fragility_runs** - Fragility scoring jobs
- **fragility_scores** - Computed fragility scores
- **fragility_drivers** - Top contributors to fragility
- **alert_rules** - Alert threshold rules
- **alerts** - Triggered alerts
- **scenarios** - Policy intervention scenarios
- **scenario_runs** - Simulation jobs
- **scenario_results** - Simulation outputs
- **projects** - Restoration/impact projects
- **project_sites** - Project geographic sites
- **project_target_metrics** - Project target metrics
- **evidence** - Field evidence submissions
- **evidence_metrics** - Evidence metric values
- **evidence_files** - Evidence file attachments
- **project_verifications** - Project verification records
- **actions** - Action items
- **audit_logs** - Audit trail

### Derived Views

- **latest_region_indicator_values** - Latest observation per region/indicator
- **latest_fragility_scores** - Latest fragility score per region
- **project_progress_summary** - Project progress aggregation
- **dashboard_hotspots** - Top regions by fragility score

---

## 🔧 Services

### Backend Services

1. **AuthService** - JWT authentication and user management
2. **OrganizationService** - Organization CRUD
3. **IngestionService** - Data source and ingestion job management
4. **IndicatorService** - Indicator and observation management
5. **RegionService** - Geographic region management
6. **FragilityService** - Fragility scoring and analysis
7. **ScenarioService** - Policy scenario simulation
8. **MrvService** - Project and evidence management
9. **AlertService** - Alert rule and alert management
10. **ActionService** - Action tracking
11. **AuditService** - Audit logging

### Service Boundaries

- **ingestion-service** - data_sources, ingestion_jobs, upload processing
- **indicator-service** - indicators, observations, region queries
- **fragility-service** - model_versions, fragility_runs, scores, drivers
- **scenario-service** - scenarios, scenario_runs, results
- **mrv-service** - projects, sites, evidence, verification
- **command-service** - actions, dashboard aggregation
- **audit-service** - audit_logs, traceability

---

## 🎨 Frontend Applications

### Planned Frontend Apps

1. **atlas-command-center** - Executive dashboard
2. **atlas-policy-sandbox** - Scenario builder and comparison
3. **atlas-mrv-portal** - Project and evidence management
4. **atlas-admin-console** - Platform administration
5. **atlas-field-app** - Mobile evidence submission

### Page Tree

#### Command Center
- `/dashboard` - Overview
- `/dashboard/hotspots` - Hotspot ranking
- `/dashboard/alerts` - Alert feed
- `/dashboard/actions` - Action queue

#### Regions
- `/regions` - Region list
- `/regions/:id` - Region detail
- `/regions/:id/indicators` - Indicator trends
- `/regions/:id/fragility` - Fragility analysis

#### Policy Sandbox
- `/scenarios` - Scenario list
- `/scenarios/new` - Create scenario
- `/scenarios/:id` - Scenario detail
- `/scenarios/:id/results` - Simulation results

#### MRV
- `/projects` - Project list
- `/projects/new` - Create project
- `/projects/:id` - Project detail
- `/projects/:id/evidence` - Evidence timeline
- `/projects/:id/verification` - Verification workflow

#### Admin
- `/admin/users` - User management
- `/admin/data-sources` - Data source management
- `/admin/indicators` - Indicator catalog
- `/admin/model-versions` - Model governance
- `/admin/audit` - Audit logs

---

## 🧮 Fragility Intelligence Engine

### Scoring Algorithm

The fragility engine computes scores across four dimensions:

1. **Economic** (30% weight) - Employment, income, market access
2. **Ecological** (25% weight) - Climate, water, land degradation
3. **Institutional** (25% weight) - Governance, capacity, services
4. **Human** (20% weight) - Health, education, social cohesion

### Risk Bands

- **Low** (0.0 - 0.3) - Stable, resilient
- **Moderate** (0.3 - 0.5) - Some vulnerabilities
- **High** (0.5 - 0.7) - Significant fragility
- **Critical** (0.7 - 1.0) - Severe fragility, immediate attention needed

### Driver Analysis

The engine identifies top contributors to fragility:
- Indicator impact magnitude
- Direction (positive/negative)
- Trend over time

---

## 🎮 Policy Sandbox

### Intervention Types

1. **Cash transfer expansion** - Direct financial support
2. **Restoration project funding** - Ecological restoration
3. **Clinic workforce increase** - Health system strengthening
4. **Water access improvement** - Infrastructure development
5. **Agricultural subsidy/pilot** - Food security
6. **Infrastructure repair allocation** - Physical infrastructure

### Simulation Process

1. Analyst creates scenario with target region and intervention
2. Adjusts budget, timeline, and assumptions
3. Atlas generates projected outcomes
4. Decision Maker compares scenarios
5. Approved scenarios become actions

---

## 📊 Restoration MRV

### Project Types

1. **Reforestation** - Tree planting and forest restoration
2. **Watershed repair** - Water system rehabilitation
3. **Soil rehabilitation** - Land restoration
4. **Community health/environment** - Health interventions
5. **Mangrove/coastal protection** - Coastal ecosystem restoration
6. **Regenerative agriculture** - Sustainable farming practices

### Evidence Types

- **Field observation** - On-site observations
- **Photo** - Photographic evidence
- **Document** - Reports and documents
- **Sensor reading** - Automated sensor data
- **Satellite analysis** - Remote sensing data
- **Audit note** - Audit observations

### Verification Workflow

1. Project created with target metrics
2. Field Verifier submits evidence
3. Analyst reviews evidence and metrics
4. Atlas updates verification status
5. Verified outcomes appear in dashboard

---

## 🚨 Alert System

### Alert Rules

- Metric-based thresholds
- Operator conditions (>=, >, <=, <, ==, !=)
- Scope filtering (region level, country)
- Severity levels (low, medium, high, critical)

### Alert Lifecycle

1. Alert rule created
2. System evaluates rules against current data
3. Alert triggered when threshold exceeded
4. Alert acknowledged by operator
5. Alert resolved when issue addressed

---

## 📈 Success Metrics

The MVP is working if a pilot team can:

1. ✅ Ingest and normalize data from at least 3 source types
2. ✅ Generate fragility scores for real regions
3. ✅ Run and compare scenarios in under a few minutes
4. ✅ Verify field evidence for restoration projects
5. ✅ Make and track actions from dashboard insights

---

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Auth & organizations
- ✅ Regions & indicators
- ✅ File upload & ingestion
- ✅ Dashboard shell

### Phase 2
- ✅ Fragility scoring
- ✅ Hotspot maps
- ✅ Alert rules
- ✅ Action logging

### Phase 3
- ✅ Scenario builder
- ✅ Simulation runs
- ✅ Results compare UI

### Phase 4
- ✅ Projects
- ✅ Evidence uploads
- ✅ Verification workflow

### Phase 5
- Model governance
- Audit hardening
- Partner API exposure

---

## 🔐 Security

### Authentication
- JWT-based authentication
- Refresh token rotation
- Password hashing with bcrypt

### Authorization
- Role-based access control (RBAC)
- Organization-scoped tenancy
- Soft delete for data recovery

### Audit
- Comprehensive audit logging
- Before/after state tracking
- User action attribution

---

## 🛠️ Development

### Project Structure

```
atlas-sanctum/
├── backend/
│   ├── src/
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── app.ts          # Express app
│   │   └── types/          # TypeScript types
│   ├── db/
│   │   ├── migrations/     # SQL migrations
│   │   └── seed.ts         # Seed data
│   ├── package.json
│   └── tsconfig.json
├── apps/
│   └── web/                # Frontend applications
├── contracts/              # Smart contracts
└── packages/
    └── sdk/                # Shared SDK
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run migrate      # Run database migrations
npm run seed         # Seed database
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code
```

### Environment Variables

See `.env.example` for all configuration options.

---

## 📝 License

Atlas Sanctum MVP - Built for humanitarian impact.

---

## 🤝 Contributing

This is an MVP designed to prove the core thesis. Contributions welcome for:
- Additional intervention types
- Enhanced simulation models
- Improved geospatial processing
- Mobile field app development
- Integration with external data sources

---

## 📞 Support

For questions or support, contact the Atlas Humanitarian team.

---

**Atlas Sanctum MVP** - Sensing fragility, simulating decisions, verifying restoration, helping institutions act.
