# Contributing to Atlas Sanctum

Thank you for investing your time in Atlas Sanctum. Every contribution — code, documentation, research, design, or governance — moves us closer to regenerative intelligence at civilization scale.

---

## Table of Contents

- [Before You Start](#before-you-start)
- [Development Setup](#development-setup)
- [Branch Naming](#branch-naming)
- [Commit Conventions](#commit-conventions)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Documentation Expectations](#documentation-expectations)
- [Review Process](#review-process)
- [Getting Help](#getting-help)

---

## Before You Start

- Read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Read [PHILOSOPHY.md](PHILOSOPHY.md) — understand what we're building and why
- Check [open issues](https://github.com/AtlasSanctum/atlas-sanctum/issues) before opening a new one
- For large changes, open a discussion or RFC first — don't spend weeks on something that won't merge

---

## Development Setup

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20+ |
| npm | 10+ |
| Git | 2.40+ |

### Steps

```bash
# 1. Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/atlas-sanctum.git
cd atlas-sanctum

# 2. Add the upstream remote
git remote add upstream https://github.com/AtlasSanctum/atlas-sanctum.git

# 3. Install dependencies
npm install

# 4. Copy environment variables
cp .env.example .env
# Fill in required values — see .env.example for documentation

# 5. Start the development server
npm run dev
```

The app runs at `http://localhost:5173`.

### Backend (optional)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

---

## Branch Naming

```
<type>/<short-description>

feature/knowledge-graph-ui
fix/satellite-feed-latency
docs/contributing-guide
chore/update-dependencies
refactor/auth-context
hotfix/payment-webhook-crash
```

| Prefix | Use for |
|--------|---------|
| `feature/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation only |
| `chore/` | Tooling, deps, config |
| `refactor/` | Code restructuring without behavior change |
| `hotfix/` | Critical production fixes |
| `release/` | Release preparation |

Branch off `develop` for features and fixes. Branch off `main` only for hotfixes.

---

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation change |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure, no behavior change |
| `test` | Adding or fixing tests |
| `chore` | Build, tooling, dependencies |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |
| `revert` | Revert a previous commit |

### Examples

```
feat(knowledge-graph): add relationship strength visualization
fix(auth): resolve token refresh race condition
docs(api): document /v2/forecast endpoint parameters
chore(deps): bump framer-motion to 11.3.0
test(simulation): add Monte Carlo edge case coverage
```

### Breaking Changes

```
feat(api)!: rename /forecast to /v2/forecast

BREAKING CHANGE: The /forecast endpoint has been removed.
Migrate to /v2/forecast — see MIGRATION.md for details.
```

---

## Coding Standards

### TypeScript

- Strict mode is enabled — no `any` without justification
- Prefer explicit return types on exported functions
- Use `interface` for object shapes, `type` for unions and aliases
- No `// @ts-ignore` — fix the type or open an issue

### React

- Functional components only
- Custom hooks for all stateful logic — keep components thin
- Lazy-load all page-level components (`React.lazy`)
- No inline styles — use Tailwind classes

### Style

- Tailwind CSS for all styling
- Follow the existing design token system (`text-primary`, `bg-muted`, etc.)
- Framer Motion for animations — keep durations under 400ms
- Accessible by default: ARIA labels, keyboard navigation, color contrast

### File Structure

```
src/pages/         — Route-level page components
src/components/    — Reusable UI components
src/hooks/         — Custom React hooks
src/lib/           — Pure utilities and business logic
src/services/      — API and external service clients
src/types/         — Shared TypeScript types
```

### Linting

```bash
npm run lint          # Check
npm run lint:fix      # Auto-fix safe issues
npm run typecheck     # TypeScript check
```

CI will fail on lint errors. Fix them before pushing.

---

## Testing Requirements

### Run Tests

```bash
npm test                    # Unit tests (Vitest)
npm run test:coverage       # With coverage report
npx playwright test         # E2E tests
```

### What to Test

| Layer | Requirement |
|-------|-------------|
| Utility functions | 100% coverage |
| Custom hooks | Test all state transitions |
| API services | Mock external calls, test error paths |
| Components | Test user interactions, not implementation |
| E2E | Cover critical user flows |

### What Not to Test

- Third-party library internals
- Trivial getters/setters
- Snapshot tests for rapidly changing UI

### Coverage Thresholds

```
Statements : 70%
Branches   : 65%
Functions  : 70%
Lines      : 70%
```

---

## Pull Request Process

### Before Opening a PR

```bash
# Sync with upstream
git fetch upstream
git rebase upstream/develop

# Run the full check suite
npm run lint
npm run typecheck
npm test
npm run build
```

### PR Checklist

- [ ] Branch is up to date with `develop`
- [ ] All CI checks pass
- [ ] Tests added or updated for changed behavior
- [ ] Documentation updated if public API changed
- [ ] Breaking changes documented in PR description
- [ ] No secrets, credentials, or PII in the diff
- [ ] Self-reviewed the diff before requesting review

### PR Title

Follow the same Conventional Commits format:

```
feat(satellite): add live feed severity filtering
fix(auth): handle expired refresh token gracefully
```

### PR Description Template

The `.github/pull_request_template.md` will auto-populate when you open a PR.

### Draft PRs

Open as a draft if you want early feedback before it's ready to merge.

---

## Documentation Expectations

- Public API changes → update `docs/api/` and `openapi.yaml`
- New pages → add route to `src/App.tsx` and navigation
- New environment variables → add to `.env.example` with description
- Architecture changes → update `ARCHITECTURE.md`
- Breaking changes → add entry to `CHANGELOG.md`

---

## Review Process

1. At least **1 approval** required from a maintainer
2. All CI checks must pass
3. No unresolved review comments
4. Squash merge into `develop` (maintainer handles this)

Reviews aim to be completed within **3 business days**. If your PR has been waiting longer, ping `@atlas-sanctum/maintainers` in the PR.

### Review Philosophy

Reviews are about the code, not the person. Feedback should be:
- Specific and actionable
- Explained with reasoning
- Kind — we're all building toward the same goal

---

## Getting Help

- **GitHub Discussions** — questions, ideas, RFCs
- **Issues** — bugs and feature requests
- **security@atlassanctum.org** — security vulnerabilities (never public issues)

---

*Built with ❤️ for humanity.*
