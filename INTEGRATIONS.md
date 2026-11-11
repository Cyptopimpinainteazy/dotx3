# dotx3 integration delivery

The `/labs` route ports real demos from x3lang commit
`a120169cb41e8e30f7a5fd4002de2506388137b2` (PR #191, stacked on #189).
`scripts/sync-x3lang.py` copies an allowlist, requires a clean source checkout,
and records source/output hashes. It rewrites two Attack Lab evidence links to
the pinned GitHub source. No private reports or wallet material are copied.

| Surface           | Implementation                                                                        | Remaining boundary                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| .x3 compiler      | Editable mandate/intent → real Python frontend and policy evaluator at `/api/compile` | Real local HTTP/browser compiler checks; no signing. Deployed Function verification is recorded separately. |
| Signed quote demo | Same-origin port at `/labs/guard/index.html`                                          | Dry quote preview; no settlement                                                                            |
| Judge/tests       | Same-origin port at `/labs/guard/judge.html`                                          | Local browser policy; operator evidence remains separate                                                    |
| Attack Lab        | Same-origin port at `/labs/attack/attack-lab.html`                                    | Local policy scenarios; no real scan                                                                        |
| Control Room      | Existing access-controlled site linked                                                | Operational API/worker controls not ported                                                                  |
| Phantom           | Integration state visible; no invented endpoint                                       | Need canonical source, worker API and report-authentication contract                                        |
| Radar             | Integration state visible; no invented telemetry                                      | Need canonical source and data contract                                                                     |
| Eye               | Existing desktop shell linked                                                         | No change to desktop/device permissions                                                                     |

Python Function packaging is appended after Nitro's production build by
`scripts/package-compiler.py`, using pinned official `vercel-runtime` 0.24.2.
It emits a separate Python 3.12 Function and explicit route before Nitro's
catch-all. The function accepts bounded JSON, checks browser origin, never
logs source, imports pinned compiler bytes and has no transaction endpoint.
Read-only network preflight stays operator-local in x3lang. This API requires
platform request limiting before unrestricted public operation; it does not
provide user accounts or authenticated private source storage. Paste public
source only. No production deployment is claimed until the actual Function
and static/SSR routes are exercised on Vercel.

Development: `python3 scripts/dev-compiler.py` serves the compiler on loopback;
the existing Vite dev server proxies only `/api/compile` to it. Production
uses the packaged Python Function. Preserve the existing Grok branding/auth
and middleware. No new database or authentication flow was added.

Tests: `python3 -m unittest discover -s tests -v`, `npm run typecheck`,
`npm run build`. Browser smoke needs the browser binaries; unavailable binaries
or failed downloads must remain a verification blocker.

Vercel CLI and MCP are authenticated, and previews can be deployed. The combined Python Function still requires an actual deployed request before claiming production execution. Custom domain verification requires Cloudflare DNS records; production has not been promoted. No donation address, capital-return promise or flash-loan
feature is enabled. Funding terms need an explicit cap, fee/loss treatment,
return recipient and deadline before any public request.
