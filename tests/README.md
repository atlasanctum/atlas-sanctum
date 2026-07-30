# tests/

Atlas Sanctum test suite — organized by scope.

## Structure

```
tests/
├── unit/         — Pure function and module tests (no I/O)
├── integration/  — Service-to-service and database integration tests
└── e2e/          — End-to-end browser and API tests
```

## Running Tests

```bash
# Unit tests (fast, no dependencies)
npm test

# Integration tests (requires running backend + database)
npm run test:integration

# End-to-end tests (requires full stack)
npm run test:e2e

# Playwright E2E
npm run test:e2e:playwright
```

## Test Locations

| Scope | Location | Runner |
|-------|----------|--------|
| Frontend unit | `src/test/` | Vitest |
| Backend unit | `backend/src/__tests__/` | Vitest |
| Chain unit | `chain/tests/` | Go test |
| E2E (Playwright) | `e2e/` | Playwright |
| E2E (Cypress) | `cypress/e2e/` | Cypress |
| SDK tests | `tests/unit/` | Vitest |
| Integration | `tests/integration/` | Vitest |

## Coverage Requirements

| Layer | Minimum Coverage |
|-------|----------------|
| SDK public API | 90% |
| Backend services | 80% |
| Constitutional Rule Engine | 100% |
| Covenant Registry | 95% |
| Chain modules | 85% |

## Writing Tests

- Unit tests: no network, no database, no filesystem
- Integration tests: use test containers or mocked services
- E2E tests: run against a staging environment, never production
- All tests must be deterministic and idempotent
