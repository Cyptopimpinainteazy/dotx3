# Intents integration rollout

This change adds a local fee/deadline planning lab to DEX and Bootcamp, public provider incident observations to DEX and Proof, twelve original Bootcamp lessons and a downloadable manual, and Copy page to SiteShell pages.

The embedded DEX is a separate application: copying its parent page includes a link, not the iframe's contents. Copy page excludes form values, navigation, scripts, and widgets marked `data-copy-exclude`.

## Server configuration

Set `NEAR_INTENTS_SHIELD_JWT` in the hosting secret manager for the server. Obtain a SHIELD-type key; the Explorer key cannot substitute. No credential is bundled or required for tests. Missing/invalid access produces unknown. This integration supports GET only and exposes public incident fields only. Contradictory operational/incident data, blank scopes and responses over 1 MiB produce unknown. The cache is per server instance, lasts 30 seconds, and is not a shared Redis deployment. Redis provisioning and integration remain outstanding.

## Execution boundaries

The planner uses generic public-swap fees for education, not a binding quote or partner agreement. Owner-configured fees have not been activated. Dry mode never authorizes execution. The deadline source supplied in the discussion contradicts itself about over-limit estimates: this local policy caps the proposed deadline and refuses execution if the estimate cannot fit. It does not modify provider-signed quote data.

An incident feed does not prove provider mode, chain finality, compliance clearance, or settlement. Provider status is separate from X3 Shield. Live execution, Earn, Hyperliquid funding, solver operation, external incident submission, and credential rotation require separately verified paths and owner approval. Treasury references must never become deposit destinations.

## Verification

Run `npm run typecheck`, `npm test`, and `npm run build`. Browser review must cover DEX/Proof status refresh and expiration, Bootcamp search/planner, Copy page and download fallback, and narrow-screen layout. Local dev and production browser review passed on desktop (1280 px) and mobile (390 px): DEX, Proof, Bootcamp and Back returned 200 without console errors or horizontal overflow. Checked local planning/refusals, Bootcamp search, copy excluding form values, iframe reference export, clipboard-denial download fallback and simulated incident expiry. Missing SHIELD credentials returned unknown. The UI refuses missing, malformed or noncanonical observation times and timestamps more than five seconds ahead of its local clock; valid observations expire after thirty seconds. Simulated provider responses are UI tests, not live provider verification. No database migration ran; DATABASE_URL was unset for the build.

The paired planning and SHIELD helpers match [X3Lang source 7f2e6d1](https://github.com/Cyptopimpinainteazy/x3lang/tree/7f2e6d1fefb9d2b8f1207ae9cf8e552d69bad9fd/x3-lang/near/integration-guidance). SHA-256: planning.ts `643cab107d47433dd4e56bff278011abb3b8d81f943ec026c209b9afa3b959ef`; shield.mjs `cdd6403497b15adf07f376608148d95d0da3c8a68722dec9d5f9540eda10069f`.
