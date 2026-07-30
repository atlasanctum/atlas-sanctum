# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| `main` (latest) | ✅ Active |
| `v2.x` | ✅ Active |
| `v1.x` | ⚠️ Critical fixes only |
| `< v1.0` | ❌ End of life |

---

## Reporting a Vulnerability

**Do not report security vulnerabilities through public GitHub issues, pull requests, or discussions.**

### Private Reporting (Preferred)

Use GitHub's built-in private vulnerability reporting:

**[Report a vulnerability →](https://github.com/AtlasSanctum/atlas-sanctum/security/advisories/new)**

### Email

If you prefer email:

**security@atlassanctum.org**

Encrypt sensitive reports using our PGP key (fingerprint published at `https://atlassanctum.org/.well-known/security.txt`).

### What to Include

- Affected component and version
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Any suggested mitigations (optional)

---

## Response Timeline

| Stage | Target |
|-------|--------|
| Acknowledgement | Within 48 hours |
| Initial assessment | Within 5 business days |
| Status update | Every 7 days until resolved |
| Fix for critical issues | Within 14 days |
| Fix for high issues | Within 30 days |
| Fix for medium/low issues | Within 90 days |

---

## Disclosure Policy

We follow **coordinated disclosure**:

1. You report privately
2. We acknowledge and investigate
3. We develop and test a fix
4. We release the fix
5. We publish a security advisory (CVE if applicable)
6. You may publish your findings after the advisory is public

We ask for a **90-day embargo** from the time of acknowledgement before public disclosure. We will work with you to meet this timeline. If we cannot fix within 90 days, we will communicate openly about the delay.

We will credit researchers who report valid vulnerabilities in our security advisories, unless you prefer to remain anonymous.

---

## Scope

### In Scope

- Authentication and authorization bypasses
- Remote code execution
- SQL injection / NoSQL injection
- Cross-site scripting (XSS)
- Cross-site request forgery (CSRF)
- Insecure direct object references
- Sensitive data exposure
- Server-side request forgery (SSRF)
- Privilege escalation
- Supabase Row Level Security (RLS) bypasses
- API key or token leakage
- Dependency vulnerabilities with exploitable attack vectors

### Out of Scope

- Denial of service attacks
- Social engineering of Atlas Sanctum staff
- Physical security
- Issues in third-party services we do not control
- Vulnerabilities requiring physical access to a user's device
- Self-XSS (requires victim to execute malicious code themselves)
- Missing security headers without demonstrated exploitability
- Rate limiting on non-sensitive endpoints

---

## Bug Bounty

We do not currently operate a paid bug bounty program. We recognize researchers with:

- Credit in security advisories
- Public acknowledgement in `AUTHORS.md` (if desired)
- A personal thank-you from the core team

---

## Security Best Practices for Contributors

- Never commit secrets, credentials, or API keys — use `.env` files (gitignored)
- Run `npm audit` before submitting PRs
- Follow the principle of least privilege in all new code
- Validate and sanitize all user inputs
- Use parameterized queries — never string-concatenate SQL
- Review [OWASP Top 10](https://owasp.org/www-project-top-ten/) before building new features

---

## Contact

**security@atlassanctum.org**

For non-security issues, use [GitHub Issues](https://github.com/AtlasSanctum/atlas-sanctum/issues) or [Discussions](https://github.com/AtlasSanctum/atlas-sanctum/discussions).
