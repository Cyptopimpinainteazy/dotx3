# Intents integration rollout

This change adds a local fee/deadline planning lab to DEX and Bootcamp, public provider incident observations to DEX and Proof, twelve original Bootcamp lessons and a downloadable manual, and Copy page to SiteShell pages, the full-screen DEX, and four ported static labs.

The embedded DEX is a separate application: copying its parent page includes a link, not the iframe's contents. Copy page excludes form values, navigation, scripts, and widgets marked `data-copy-exclude`.

## Server configuration

Set `NEAR_INTENTS_SHIELD_JWT` in the hosting secret manager for the server. Obtain a SHIELD-type key; the Explorer key cannot substitute. No credential is bundled or required for tests. Missing/invalid access produces unknown. This integration supports GET only and exposes public incident fields only. The cache is per server instance, lasts 30 seconds, and is not a shared Redis deployment. The separate Explorer reader uses the approved permanent shared HTTPS Redis service for its cache and partner-wide limiter. SHIELD keeps a short per-instance cache; it never authorizes execution.

## Execution boundaries

The planner uses generic public-swap fees for education, not a binding quote or partner agreement. Owner-configured fees have not been activated. Dry mode never authorizes execution. The deadline source supplied in the discussion contradicts itself about over-limit estimates: this local policy caps the proposed deadline and refuses execution if the estimate cannot fit. It does not modify provider-signed quote data.

An incident feed does not prove provider mode, chain finality, compliance clearance, or settlement. Provider status is separate from X3 Shield. Live execution, Earn, Hyperliquid funding, solver operation, external incident submission, and credential rotation require separately verified paths and owner approval. Treasury references must never become deposit destinations.

## Verification

Run `npm run typecheck`, `npm test`, and `npm run build`. Browser review must cover DEX/Proof status refresh and expiration, Bootcamp search/planner, Copy page and download fallback, and narrow-screen layout. Local browser review was blocked by the workspace browser/network restrictions; a production preview must be checked before merge.

## Owner-approved Explorer scope

The owner confirmed both scopes on November 11, 2026. Set server-only
`X3_EXPLORER_SEARCH` to `{"account":"dotx3.near","referral":"x3star"}`.
The public selector chooses only `scope=account` or `scope=referral`; account
maps to the provider's `search` parameter and referral maps to its `referral`
parameter. Client-supplied search/referral values are rejected. Both scopes share
the same partner-wide Redis limiter; they are separate selectable pages, not an
exhaustive merged transaction history. Vercel preview/production now hold this
scope configuration; Redis credentials are configured as sensitive Vercel variables; provider JWTs and live provider checks remain release gates.

The UI export uses a shared deterministic helper for shell, full-screen DEX and
static labs. It excludes form values, the wallet/navigation header and private
widgets; embedded content is linked rather than traversed. Markdown tables have
header separators and escaped cells. Static lab source digests remain upstream
identities; destination digests include the documented local export transform.
