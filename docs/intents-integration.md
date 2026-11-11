# Intents integration rollout

This change adds a local fee/deadline planning lab to DEX and Bootcamp, public provider incident observations to DEX and Proof, twelve original Bootcamp lessons and a downloadable manual, and Copy page to SiteShell pages.

The embedded DEX is a separate application: copying its parent page includes a link, not the iframe's contents. Copy page excludes form values, navigation, scripts, and widgets marked `data-copy-exclude`.

## Server configuration

Set `NEAR_INTENTS_SHIELD_JWT` in the hosting secret manager for the server. Obtain a SHIELD-type key; the Explorer key cannot substitute. No credential is bundled or required for tests. Missing/invalid access produces unknown. This integration supports GET only and exposes public incident fields only. The cache is per server instance, lasts 30 seconds, and is not a shared Redis deployment. Redis provisioning and integration remain outstanding.

## Execution boundaries

The planner uses generic public-swap fees for education, not a binding quote or partner agreement. Owner-configured fees have not been activated. Dry mode never authorizes execution. The deadline source supplied in the discussion contradicts itself about over-limit estimates: this local policy caps the proposed deadline and refuses execution if the estimate cannot fit. It does not modify provider-signed quote data.

An incident feed does not prove provider mode, chain finality, compliance clearance, or settlement. Provider status is separate from X3 Shield. Live execution, Earn, Hyperliquid funding, solver operation, external incident submission, and credential rotation require separately verified paths and owner approval. Treasury references must never become deposit destinations.

## Verification

Run `npm run typecheck`, `npm test`, and `npm run build`. Browser review must cover DEX/Proof status refresh and expiration, Bootcamp search/planner, Copy page and download fallback, and narrow-screen layout. Local browser review was blocked by the workspace browser/network restrictions; a production preview must be checked before merge.
