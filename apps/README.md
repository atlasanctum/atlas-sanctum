# apps/

Atlas Sanctum application layer. Each app is independently deployable.

| App | Description | Stack |
|-----|-------------|-------|
| `dashboard/` | Primary platform dashboard — impact metrics, governance, portfolio | React + Vite + Tailwind |
| `marketplace/` | Regenerative credit marketplace — carbon, biodiversity, water, ocean | React + Vite |
| `governance/` | DAO governance studio — proposals, voting, constitutional amendments | React + Vite |
| `mobile/` | Mobile companion app — field agents, community reporting, impact tracking | React Native |

## Structure

Each app follows the same internal layout:

```
apps/<name>/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── lib/
├── public/
├── package.json
└── README.md
```

## Current State

The primary dashboard and marketplace are implemented in `src/` at the monorepo root.
Migration to this `apps/` structure is tracked in the roadmap.
