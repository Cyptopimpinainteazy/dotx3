# NEAR Intents release owner actions and rollback

## Authorized work

The owner authorized code, tests, parity repair, independent review, eligible merges,
preview/production deployment and smoke checks. Account search `dotx3.near` and partner
referral `x3star` are approved public scopes. `X3_EXPLORER_SEARCH` is configured through
Vercel for preview and production; no browser-exposed environment prefix is used.

## Provisioned Redis

The owner explicitly approved Upstash terms and account-data sharing. The permanent
`dotx3-explorer-cache` resource (`store_wxgGFrtsAscqMIuX`) is provisioned on plan `free`,
region `iad1`, `autoUpgrade=false`, `prodPack=false`, `eviction=false`, connected to
preview and production. No paid plan was selected. The HTTPS URL and write-capable
command token are stored as sensitive server-only `X3_EXPLORER_REDIS_URL` and
`X3_EXPLORER_REDIS_TOKEN` in Vercel. No credential value is recorded here.

## Owner actions still needed

1. **Explorer credential:** supply an unexposed Explorer-type JWT directly in Vercel
   as server-only `NEAR_INTENTS_EXPLORER_JWT`. The earlier chat credential must not be
   reused. The owner deferred rotation after initially approving it; no credential
   was rotated or reused during this release task. An existing unexposed key is also
   usable if its access and partner identity are verified.
2. **SHIELD credential:** supply the separate SHIELD-type JWT in Vercel as server-only
   `NEAR_INTENTS_SHIELD_JWT`. An Explorer JWT cannot substitute. Partner Portal sign-in
   is unavailable in the agent browser until the owner authenticates there.

The configured `X3_EXPLORER_REDIS_URL` is the HTTPS command API, not a native Redis URL. A native
`redis://`/`rediss://` URL is incompatible. All deployment instances and other
cooperating clients of partner `x3star` must share the same coordinator.

A free temporary scratch Redis attempt did not yield a recognized credential
format, so it is not used for deployment and is not claimed as successful Redis
verification. Do not substitute a 72-hour scratch service for permanent hosting.

## Completion gates

- Actual mirrored-file bytes and executable modes, not a bypass of the mirror gate.
- Exact-head required CI and independent review before eligible merges.
- Real read-only Explorer and SHIELD responses after server credentials are present.
- Redaction, real Redis TTL expiry, concurrent client/partner rate limiting, and
  missing/failed/malformed provider/coordinator states. Unit fixtures alone are not
  evidence that live provider authentication or shared hosted Redis works.
- Exact deployed desktop/mobile interactions: DEX planner, Proof scopes/history,
  Bootcamp search, page Copy/Markdown download, and incident expiry after 30 seconds.
- Standalone DEX and static labs must retain public-content export controls and
  exclude form/wallet/private values; parent DEX copy links the iframe only.
- Production version/deployment/commit identity and smoke checks after promotion.

No funds, activated fees, incident submissions, solver enrollment, additional legal acceptance,
credential rotation or paid services are implied by this document.

## Rollback

Before promotion, record the current production deployment and source commit again;
concurrent releases may change them. The observed baseline was:

- Deployment: `dpl_9qoiiRMgKTfzH3DU7uKEyord5QLg`
- URL: `dotx3-di3wj9ro4-cyptopimpinainteazys-projects.vercel.app`
- Commit: `8af4b39dc6233ca8528c2b1bbdad3cdd90fcff30`

If the release introduces routing errors, credential exposure or incorrect evidence
labels, restore that captured ready deployment using Vercel's Instant Rollback UI,
or `vercel rollback <captured-deployment-url> --scope cyptopimpinainteazys-projects`.
Verify `dotx3.net` and critical routes afterward. Do not roll back shared Redis or
re-enable a revoked credential; rollback does not undo provider-side actions.
The integration performs no database schema migrations or fund movements of its own.

Do not disable deployment protection for testing. The CLI `vercel curl` unexpectedly
created an automation bypass during investigation; that newly created bypass was
immediately revoked and its removal verified. No automation bypass was retained.
