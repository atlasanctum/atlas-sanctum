# Decentralized AI Governance Backend

Backend API for the Decentralized AI Governance Design system.

## Features

- **Proposals Management**: Create, update, and track governance proposals
- **Voting System**: Support for multiple voting mechanisms (Quadratic, Conviction, Holographic, Futarchy, Liquid Democracy, Optimistic, ZK)
- **Reputation System**: Soulbound tokens and reputation scoring
- **Delegation**: Liquid democracy with domain-specific delegation
- **Challenges**: Optimistic governance with challenge resolution
- **Impact Tracking**: Retroactive public goods funding (RPGF) with impact certificates
- **Analytics**: Governance metrics and participation tracking
- **Real-time Updates**: Socket.io integration for live updates

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for caching)

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
```

## Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

## Development

```bash
# Start development server with hot reload
npm run dev
```

## Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## API Endpoints

### Proposals
- `GET /api/proposals` - List all proposals
- `GET /api/proposals/:id` - Get single proposal
- `POST /api/proposals` - Create proposal
- `PUT /api/proposals/:id` - Update proposal
- `DELETE /api/proposals/:id` - Delete proposal
- `GET /api/proposals/stats/overview` - Proposal statistics

### Voting
- `GET /api/voting/proposal/:proposalId` - Get votes for proposal
- `POST /api/voting` - Cast a vote
- `GET /api/voting/results/:proposalId` - Get voting results
- `GET /api/voting/member/:memberId` - Get member's voting history

### Reputation
- `GET /api/reputation/member/:memberId` - Get member reputation
- `GET /api/reputation/leaderboard` - Get reputation leaderboard
- `GET /api/reputation/experts/:domainId` - Get domain experts
- `GET /api/reputation/badges` - List all badges

### Delegation
- `GET /api/delegation/member/:memberId` - Get member's delegations
- `GET /api/delegation/received/:memberId` - Get received delegations
- `POST /api/delegation` - Create delegation
- `DELETE /api/delegation/:delegatorId` - Revoke delegation
- `GET /api/delegation/stats` - Delegation statistics

### Challenges
- `GET /api/challenges/proposal/:proposalId` - Get proposal challenges
- `POST /api/challenges` - Create challenge
- `POST /api/challenges/:challengeId/resolve` - Resolve challenge
- `GET /api/challenges/active` - Get active challenges

### Impact
- `GET /api/impact/rounds` - Get RGF rounds
- `POST /api/impact/rounds` - Create RGF round
- `GET /api/impact/projects/:roundId` - Get projects for round
- `POST /api/impact/projects` - Create project
- `POST /api/impact/attestations` - Submit attestation
- `GET /api/impact/certificates` - List impact certificates

### Analytics
- `GET /api/analytics/metrics` - Get governance metrics
- `GET /api/analytics/overview` - Get overview statistics
- `GET /api/analytics/participation` - Get participation stats
- `GET /api/analytics/proposal-types` - Get proposal type distribution
- `GET /api/analytics/threats` - Get threat detection stats

### Members
- `GET /api/members` - List all members
- `GET /api/members/:id` - Get single member
- `GET /api/members/wallet/:address` - Get member by wallet
- `POST /api/members` - Create/update member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Deactivate member
- `GET /api/members/domains/list` - List domains

## WebSocket Events

- `join-proposal` - Join room for proposal updates
- `leave-proposal` - Leave proposal room
- Vote updates are broadcasted to proposal rooms

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_NAME | Database name | governance_db |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | - |
| PORT | Server port | 3001 |
| NODE_ENV | Environment | development |
| CORS_ORIGIN | CORS origin | localhost:5173 |
| REDIS_URL | Redis connection URL | - |
