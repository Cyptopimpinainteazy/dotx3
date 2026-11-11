# Better Auth 1.7 security upgrade candidate

This candidate upgrades Better Auth 1.6.33 to 1.7.20 and replaces its removed
Generic OAuth client/server APIs with the supported social-provider APIs.
The dependency and local build checks do not verify a real broker sign-in.

## Merge and deployment blockers

- Review the broker registrations for both `grok-google` and `grok-x`. Better Auth
  1.7 now returns to `/api/auth/callback/<providerId>` instead of
  `/api/auth/oauth2/callback/<providerId>`. The checked-in preview documentation
  still describes the old registration; its actual allowed callbacks were not
  changed or verified. Production registrations also need verification.
- Confirm the broker's immutable user-info account identifier. The former
  Generic OAuth implementation accepted `id` with a `sub` fallback. The new
  static-provider default accepts only `id`. Do not guess a fallback or alter
  existing account identities; verify the broker response and existing mapping
  before choosing an explicit resolver if required.
- Exercise real sign-in, repeat sign-in to the same account, and sign-out with
  the approved broker configuration before calling authentication verified.

The application auth flag remains off. No database, provider registration or
production deployment was changed. The current plugin list has no Magic Link
plugin, so the critical npm advisory alone does not demonstrate that this
application is exploitable.

The current official guide states that 1.7.3+ uses the same account schema as
1.6; the temporary issuer requirement in 1.7.0–1.7.2 does not apply here.

Sources:
- https://github.com/better-auth/better-auth/security/advisories/GHSA-965c-763c-88jm
- https://better-auth.com/docs/guides/1-7-upgrade-guide
- https://github.com/better-auth/better-auth/releases/tag/v1.7.20
