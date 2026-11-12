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

## Read-only compatibility investigation — 2026-11-11

The public broker discovery document was retrieved without credentials from
https://auth.grok.me/api/auth/.well-known/openid-configuration. It reports:

| Property | Observed value |
| --- | --- |
| Issuer | `https://auth.grok.me` |
| Authorization endpoint | `https://auth.grok.me/api/auth/oauth2/authorize` |
| Token endpoint | `https://auth.grok.me/api/auth/oauth2/token` |
| User-info endpoint | `https://auth.grok.me/api/auth/oauth2/userinfo` |
| Subject types | `public` |
| Subject claim advertised | `sub`; `id` is not listed in supported claims |
| PKCE methods | `S256` |

Discovery confirms the configured endpoints and advertised protocol. It does
not establish the authenticated user-info response's exact shape, existing
account-key mapping, or either client's registered callback allowlist.

Installed 1.7.20 source exposes `OAuthProvider.callbackPath` in
`@better-auth/core/dist/oauth2/oauth-provider.d.mts`, but the Generic OAuth
configuration does not expose that option and the core handler is mounted at
`/callback/:id`. The Generic OAuth `redirectURI` override is an absolute string;
it does not provide a matching legacy handler or per-request preview-host
mapping. Keeping the old callback therefore needs a reviewed adapter and
handler with state/PKCE regression evidence, or verified broker registrations
for the new callback. No such adapter or registration change was made.

The exact remaining evidence is: an authorized registration export containing
the callback allowlists for the preview and deployed clients; a sanitized
successful broker user-info response; and confirmation that its immutable
identifier matches existing account records for both configured provider IDs.
No token, secret, or personal profile needs to be added to this repository.

The latest published 1.6 release inspected was 1.6.34 (2026-11-01). Its official
release notes describe stateless access-token and SAML fixes, not a backport of
GHSA-965c-763c-88jm. That advisory continues to list versions below 1.7.7 as
affected. No supported 1.6 security-backport alternative was established.

Additional source: https://github.com/better-auth/better-auth/releases/tag/v1.6.34
