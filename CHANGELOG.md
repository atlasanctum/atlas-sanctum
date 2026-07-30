# Changelog

All notable changes to Atlas Sanctum are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- Roadmap pages for all 4 phases (Knowledge Graph, Satellite Integration, Predictive Analytics, Mobile App, Public APIs, Multi-Agent Intelligence, Digital Twins, Simulation Engine, Decision Intelligence, Enterprise Platform, Global Marketplace, Open Research Platform, Community Ecosystem, Developer SDK, Plugin Marketplace)
- Intelligence and Ecosystem navigation dropdowns
- `/roadmap` overview page linking all 20 platform features

### Changed
- LICENSE upgraded from MIT to Apache 2.0 with Ethical Use Clause

### Security
- Enforced `.gitignore` — untracked 156 previously committed files (eslint reports, deploy scripts, dev screenshots, internal layer, deployment topology)

---

## [2.0.0] — 2026-01-03

### Added
- Phase 2–4 architecture and infrastructure scaffolding
- Anti-manipulation engine with cryptographic verification
- Multi-phase Kubernetes and Terraform infrastructure (phases 1–6)
- Cardano blockchain layer integration
- EthosDAO governance module
- PLAAS (Platform-as-a-Service) layer definitions
- Cosmos SDK chain (`sanctumd`) with identity, impact, oracle, and rewards modules
- Post-quantum cryptography service
- Zero-knowledge proof service
- BLS threshold signature service
- Merkle tree service
- Oracle attestation service
- Extended AI orchestrator with multi-agent coordination
- Sanctum AI console page
- Beatific alignment page
- Mythic architect page

### Changed
- Dashboard upgraded with interactive metrics and feature grid
- Navigation expanded with enterprise billing, solutions, and resources dropdowns
- Authentication upgraded to enhanced auth with MFA and RBAC
- API upgraded to v2 with 64+ endpoints

### Fixed
- Dashboard performance with lazy-loaded skeleton components
- Auth token refresh race condition
- Newsletter rate limiting and abuse protections

---

## [1.2.0] — 2025-10-15

### Added
- Enterprise billing dashboard (invoices, payment methods)
- API analytics and key management
- MFA setup flow
- Checkout and customer portal
- Subscription plans page
- Donor, field agent, administrator, community, enterprise, government, DeFi, NGO role dashboards
- Explore verified projects page
- Demo login flow
- AI insights component
- Carbon credit marketplace component
- Gamification hub
- Blockchain verification component
- Decentralized governance dashboard

### Changed
- Navigation restructured with dropdown menus
- Onboarding tour added to dashboard

### Fixed
- Mobile navigation overflow
- Portfolio value calculation rounding

---

## [1.1.0] — 2025-07-20

### Added
- Carbon calculator
- Leaderboard
- Reports and analytics
- Settings page
- Transaction history
- Community, education, DeFi, regenerative finance pages
- Carbon offsetting, impact investment, regulatory compliance solution pages
- Enterprise, SMB, agriculture, renewable energy solution pages
- Education hub and certifications
- Privacy policy, terms of service, cookie policy, accessibility pages
- Media kit
- API documentation page
- Admin command center with feature flags and newsletter management
- Segment selection and onboarding flow
- Dashboard overview

### Changed
- Marketplace upgraded with project detail pages
- Portfolio upgraded with analytics

### Fixed
- Bioregional map rendering on mobile
- Valuation model calculation accuracy

---

## [1.0.0] — 2025-01-15

### Added
- Core dashboard with stats, quick links, and activity feed
- Authentication (sign up, sign in, password reset)
- Marketplace with verified carbon credit listings
- Portfolio management
- Bioregions explorer
- Measurements dashboard
- Valuation engine
- Governance module
- Regenerative agriculture module
- Health intelligence module
- Security overview
- Adoption metrics
- Engineering architecture page
- Outreach module
- Help center and contact
- Payment processing (Paystack + PayPal)
- Email notifications (SendGrid)
- Rate limiting and CORS hardening
- API key system
- Role-based access control
- Supabase authentication and database
- PostgreSQL schema with RLS policies
- 40+ REST API endpoints
- OpenAPI specification
- Docker and Docker Compose configuration
- GitHub Actions CI/CD pipeline
- Vercel deployment configuration
- Lighthouse performance monitoring

---

[Unreleased]: https://github.com/AtlasSanctum/atlas-sanctum/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/AtlasSanctum/atlas-sanctum/compare/v1.2.0...v2.0.0
[1.2.0]: https://github.com/AtlasSanctum/atlas-sanctum/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/AtlasSanctum/atlas-sanctum/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/AtlasSanctum/atlas-sanctum/releases/tag/v1.0.0
