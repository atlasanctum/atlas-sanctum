# Governance

Atlas Sanctum is governed as an open, transparent, mission-driven project. This document describes how decisions are made, who makes them, and how you can participate.

---

## Governance Structure

```
Community
    │
    ▼
Contributors          — Anyone who submits code, docs, research, or feedback
    │
    ▼
Maintainers           — Trusted contributors with merge rights
    │
    ▼
Core Team             — Full-time contributors driving the roadmap
    │
    ▼
Steering Committee    — Strategic direction and mission alignment
    │
    ▼
Technical Advisory Council — External experts in AI, climate, governance, health
```

---

## Roles

### Community Member

Anyone who participates in discussions, opens issues, or uses the platform. No formal requirements.

### Contributor

Anyone who has had a pull request merged. Contributors are listed in `AUTHORS.md`.

**Rights:** Open issues, submit PRs, participate in discussions and RFCs.

### Maintainer

Trusted contributors nominated by the Core Team. Maintainers have write access to the repository.

**Rights:** Review and merge PRs, triage issues, manage releases, participate in governance votes.

**Responsibilities:** Uphold the Code of Conduct, review PRs within 3 business days, maintain code quality standards.

**How to become one:** Consistent high-quality contributions over at least 3 months, nominated by an existing maintainer, approved by Core Team consensus.

### Core Team

Full-time contributors responsible for the platform's technical direction and day-to-day operations.

**Current Core Team:** See `AUTHORS.md`.

**Rights:** All maintainer rights, plus roadmap decisions, architecture decisions, and hiring.

### Steering Committee

Responsible for mission alignment, organizational strategy, partnerships, and funding.

**Composition:** Core Team leads + up to 3 elected community representatives.

**Community representatives** are elected annually by contributors with at least 3 merged PRs in the past 12 months.

### Technical Advisory Council (TAC)

External advisors with domain expertise in AI, climate science, public health, governance, and economics. Advisory only — no voting rights on code decisions.

---

## Decision Making

### Day-to-Day Decisions

Maintainers make routine decisions (PR reviews, issue triage, minor releases) independently, following the project's coding standards and philosophy.

### Significant Decisions

Decisions that affect the public API, architecture, roadmap, or governance require:

1. A GitHub Discussion or RFC (see below)
2. At least 7 days open for community comment
3. Lazy consensus — if no maintainer objects within 7 days, the proposal passes
4. If there is disagreement, a vote among maintainers (simple majority)

### Major Decisions

Decisions that affect the mission, license, governance structure, or major architectural pivots require:

1. An RFC with at least 14 days open for comment
2. A vote among the Steering Committee (two-thirds majority)

### Voting

- Each maintainer has one vote
- Votes are cast publicly in the relevant GitHub Discussion or RFC
- Abstentions do not count toward the majority
- The proposer may not vote on their own RFC

---

## RFC Process

An RFC (Request for Comments) is required for:

- New major features or modules
- Breaking API changes
- Changes to governance, license, or code of conduct
- Significant architectural changes

### RFC Lifecycle

```
Draft → Open for Comment → Final Comment Period (7 days) → Accepted / Rejected → Implemented
```

### How to Submit an RFC

1. Create a file in `docs/rfcs/` named `NNNN-short-title.md` (use the next available number)
2. Use the template at `docs/rfcs/0000-template.md`
3. Open a PR — this starts the comment period
4. After the Final Comment Period, a maintainer calls the vote

---

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

| Increment | When |
|-----------|------|
| `MAJOR` | Breaking changes |
| `MINOR` | New backward-compatible features |
| `PATCH` | Bug fixes and security patches |

### Release Cadence

- **Patch releases:** As needed (security fixes within 14 days)
- **Minor releases:** Monthly
- **Major releases:** Quarterly, with 30-day deprecation notice for breaking changes

### Release Steps

```
1. Update CHANGELOG.md
2. Bump version in package.json
3. Create release branch: release/vX.Y.Z
4. CI runs full test suite
5. Maintainer review and approval
6. Merge to main
7. Tag: git tag vX.Y.Z
8. GitHub Release created automatically by CI
9. Docker image published to registry
10. Announce in GitHub Discussions
```

---

## Conflict Resolution

1. Discuss in the relevant issue or PR
2. If unresolved, escalate to a GitHub Discussion tagged `governance`
3. Core Team mediates
4. If still unresolved, Steering Committee makes a final decision

---

## Amendments to This Document

Changes to this governance document require an RFC and a two-thirds majority vote of the Steering Committee.

---

## Contact

For governance questions: **governance@atlassanctum.org**

For security issues: **security@atlassanctum.org** (see `SECURITY.md`)
