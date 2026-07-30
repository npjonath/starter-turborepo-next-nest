# Security Policy

## Supported versions

This template follows a rolling support model. Security fixes are applied to
the latest commit on `main`; older snapshots and repositories created from the
template are not maintained automatically.

## Reporting a vulnerability

Do not disclose a suspected vulnerability in a public issue, discussion, pull
request, or social media post.

Use GitHub's private vulnerability reporting flow:

<https://github.com/npjonath/starter-turborepo-next-nest/security/advisories/new>

Include:

- the affected application, package, version, or commit;
- clear reproduction steps or a minimal proof of concept;
- the impact and attack preconditions;
- any suggested mitigation;
- whether the issue is already public.

Never include real credentials, personal data, or data obtained from systems
you do not own.

The maintainers will acknowledge a complete report as soon as reasonably
possible, investigate it, and coordinate a fix and disclosure. Please allow
time for remediation before publishing details.

## Dependency security

The lockfile contains explicit overrides for vulnerable transitive versions.
Run this command before release and after dependency changes:

```bash
bun run audit
```
