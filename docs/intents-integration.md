# Intents integration rollout

This change adds a local fee/deadline planning lab to DEX and Bootcamp, public provider incident observations to DEX and Proof, twelve original Bootcamp lessons and a downloadable manual, and Copy page to SiteShell pages, the full-screen DEX, and four ported static labs.

The embedded DEX is a separate application: copying its parent page includes a link, not the iframe's contents. Copy page excludes form values, navigation, scripts, and widgets marked `data-copy-exclude`.

## Server configuration

Set `NEAR_INTENTS_SHIELD_JWT` in the hosting secret manager for the server. Obtain a SHIELD-type key; the Explorer key cannot substitute. No credential is bundled or required for tests. Missing/invalid access produces unknown. This integration supports GET only and exposes public incident fields only. Contradictory operational/incident data, blank scopes and responses over 1 MiB produce unknown. The cache is per server instance, lasts 30 seconds, and is not a shared Redis deployment. The separate Explorer reader uses the approved permanent shared HTTPS Redis service for its cache and partner-wide limiter. SHIELD keeps a short per-instance cache; it never authorizes execution.

## Execution boundaries

The planner uses generic public-swap fees for education, not a binding quote or partner agreement. Owner-configured fees have not been activated. Dry mode never authorizes execution. The deadline source supplied in the discussion contradicts itself about over-limit estimates: this local policy caps the proposed deadline and refuses execution if the estimate cannot fit. It does not modify provider-signed quote data.

An incident feed does not prove provider mode, chain finality, compliance clearance, or settlement. Provider status is separate from X3 Shield. Live execution, Earn, Hyperliquid funding, solver operation, external incident submission, and credential rotation require separately verified paths and owner approval. Treasury references must never become deposit destinations.

## Verification

Run `npm run typecheck`, `npm test`, and `npm run build`. Browser review must cover DEX/Proof status refresh and expiration, Bootcamp search/planner, Copy page and download fallback, and narrow-screen layout. Earlier local browser restrictions were resolved using the deployed preview. Desktop and verified 390-pixel mobile review of the release fixes covered DEX, Proof, Bootcamp, full-screen DEX and four static labs. Downloads were inspected for form-value and navigation exclusion. A temporary browser-only synthetic SHIELD response expired to unknown after thirty seconds and interception was cleared afterward. Provider authentication remains unverified without its server credentials. Exact deployments and commits must be retained with the release evidence.

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


## Reviewed incident and planning boundary

Concurrent [PR #24](https://github.com/Cyptopimpinainteazy/dotx3/pull/24) supplied strict boolean checks, ceiling-rounded fee halves, bounded SHIELD response parsing and canonical observation-time checks. These fixes are preserved. Valid UI observations expire at thirty seconds; missing, malformed/noncanonical timestamps or timestamps over five seconds ahead are unknown. Security mode is always unknown; incidents do not authorize payment.

The paired planning and SHIELD helpers match [X3Lang source 7f2e6d1](https://github.com/Cyptopimpinainteazy/x3lang/tree/7f2e6d1fefb9d2b8f1207ae9cf8e552d69bad9fd/x3-lang/near/integration-guidance). SHA-256: planning.ts `643cab107d47433dd4e56bff278011abb3b8d81f943ec026c209b9afa3b959ef`; shield.mjs `cdd6403497b15adf07f376608148d95d0da3c8a68722dec9d5f9540eda10069f`.
