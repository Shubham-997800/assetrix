# Security Policy

Assetrix takes the security of its software and the data of its users seriously. This document describes how to report security vulnerabilities and what to expect from the maintainers.

## Supported Versions

Only the latest release on the `main` branch is actively supported with security fixes.

| Version | Supported          |
|:--------|:-------------------|
| main    | :white_check_mark: |
| < main  | :x:                |

## Reporting a Vulnerability

**Do NOT open a public GitHub issue for security vulnerabilities.**

Please report vulnerabilities privately by emailing the maintainer:

- **Email:** `shubhamkumar997800@gmail.com`
- **Subject:** `[ASSETRIX SECURITY] <short description>`

Alternatively, use GitHub's [Private Vulnerability Reporting](https://github.com/Shubham-997800/assetrix/security/advisories/new) feature on the repository.

### What to include
1. A clear description of the vulnerability.
2. The affected component and version (commit SHA if possible).
3. Steps to reproduce (PoC preferred).
4. Impact assessment (what an attacker could do).

### What to expect
- **Acknowledgement:** within 48 hours.
- **Status update:** within 5 business days.
- **Fix & disclosure:** a fix is released as quickly as possible. Details are shared after the fix is deployed so users can patch.

## Security Best Practices We Follow

- Passwords hashed with `bcrypt` (12 salt rounds).
- JWT access tokens (15 min) + rotating refresh tokens (7 days).
- Redis-backed sessions with device tracking, concurrency limits, and revocation.
- Zod schema validation on all API request payloads.
- Helmet.js security headers (CSP, HSTS, X-Frame-Options).
- Rate limiting on all endpoints and stricter limits on auth routes.
- CORS allow-listing with credential support.
- Audit logging for all sensitive operations.
- Environment secrets are never committed to the repository.

## Known Safe Harbor

We will not pursue legal action against security researchers who:
- Make a good-faith effort to avoid privacy violations, data destruction, and service interruption.
- Report the vulnerability privately before disclosing it publicly.
- Do not exploit the vulnerability beyond what is necessary to demonstrate it.

## Reporting Bugs

Non-security bugs should be reported through the [issue tracker](https://github.com/Shubham-997800/assetrix/issues/new/choose).
