# Atlas Sanctum — MVP Scaffold (minimal)

This folder contains a minimal scaffold to start Phase 0 development. It's intentionally small: implementors can copy files into the main repo or use as a reference.

Structure
- frontend/ — React + Vite starter
- backend/ — Node + Express starter
- contracts/ — Hardhat starter
- infra/ — deployment notes and minimal terraform/helm placeholders

CI
- `.github/workflows/ci.yml` is provided to run lint/build/contract compile on PRs.

Next steps
- Customize each package.json, add real implementations, and wire to Supabase.

Quick start (local)

1. Start a local Postgres instance (Docker):

```bash
docker run --name atlas-dev-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
```

2. Run migrations:

```bash
# from repo root
cd scaffold-mvp/backend
npm ci
npx ts-node ./scripts/migrate.ts
```

3. Start backend in dev:

```bash
cd scaffold-mvp/backend
npm run dev
```

4. Start frontend dev server:

```bash
cd scaffold-mvp/frontend
npm ci
npm run dev
```

Notes
- The scaffold is minimal; replace password-based auth and plain hashing before production. Use Supabase or another managed provider for prod readiness.

