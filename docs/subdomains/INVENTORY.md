# dotx3 subdomain inventory — 2026-11-11

Proposed hostname list from **314 branch refs across three repositories**. 127 candidate hostnames are listed, including explicit legacy and placeholder reservations. This inventory does not provision them or certify builds.

## Confirmed domain roles

- `dotx3.net`: public language/docs/NEAR website, Vercel project `dotx3`. Assignment exists; ownership verification is pending.
- `command.dotx3.net`: separate Vercel project `dotx3-command`, redirecting to the existing authenticated `https://controlroom.x3star.net`. Redirect deployment exists; custom-domain ownership verification is pending.
- `www.dotx3.net`: proposed redirect to the main site.

## Cloudflare handoff

Reserve the names below. For applications without a hosting target, deploy or select the app first, attach its hostname to that hosting project, then create the provider-issued DNS record. A CNAME cannot point to a URL path. Route aliases such as bootcamp need an HTTP redirect/rewrite as well as DNS.

Current Vercel ownership challenges (keep them as separate TXT values at `_vercel.dotx3.net`):

```text
vc-domain-verify=dotx3.net,a96eba28e5cdb0c7db95
vc-domain-verify=command.dotx3.net,06cafa6907fcd31cb651
```

The earlier command-domain token `448ccba8c82b2358029f` belonged to the corrected website assignment and is superseded for the command project. Vercel recommends `efc954b93e0c6a32.vercel-dns-017.com` for the command CNAME; retrieve the current apex A recommendations from the `dotx3` project before changing the existing main-site A record.

The CSV is a **planning inventory**, not a Cloudflare DNS import file: unknown hosting targets are intentionally blank.

## Core

| Proposed hostname | Frontend | Source | Readiness |
| --- | --- | --- | --- |
| `dotx3.net` | Public website | dotx3 · main · `src/routes/index.tsx` | Assigned to website project; ownership verification pending |
| `www.dotx3.net` | Main-site alias | dotx3 · main · `src/routes/index.tsx` | Proposed alias |
| `command.dotx3.net` | Existing Control Room entry | dotx3 · working tree · `integrations/controlroom-entry/vercel.json` | Redirect deployed; custom domain verification pending |

## Games and interactive

| Proposed hostname | Frontend | Source | Readiness |
| --- | --- | --- | --- |
| `blast.dotx3.net` | MEME COIN BLAST | dotx3 · claude/frontend-gallery · `public/gallery/arcade/meme-coin-blast.html` | Standalone browser game source |
| `voyager.dotx3.net` | Quantum Kernel Voyager | x3-world · main · `apps/quantum-kernel-voyager` | Vite/Three.js frontend source |
| `cosmic.dotx3.net` | Cosmic Lizard / Planet Lizard | x3-world · main · `experiments/a13-atlas/cosmic-site` | Static animated frontend experiment |
| `kitchen.dotx3.net` | The Kitchen Dilemma | xxxstar · kitchen-dilemma · `apps/kitchen-dilemma` | Standalone HTML/JS frontend |

## Applications

| Proposed hostname | Frontend | Source | Readiness |
| --- | --- | --- | --- |
| `gallery.dotx3.net` | X3 Frontend Gallery | dotx3 · claude/frontend-gallery · `public/gallery/index.html` | Static catalog frontend |
| `dex.dotx3.net` | X3DEX terminal | dotx3 · feat/dotx3-dex · `integrations/x3dex` | React/Vite frontend integrated at /dex |
| `desktop.dotx3.net` | X3 Chain Desktop | xxxstar · master · `apps/x3-desktop` | Source present; dedicated-host deployment unverified |
| `funding.dotx3.net` | Funding Portal | xxxstar · master · `apps/x3-funding` | Source present; dedicated-host deployment unverified |
| `transparency.dotx3.net` | Transparency Portal | xxxstar · master · `apps/x3-transparency` | Source present; dedicated-host deployment unverified |
| `validators.dotx3.net` | Validator Globe | xxxstar · master · `apps/validators` | Source present; dedicated-host deployment unverified |
| `inferstructor.dotx3.net` | Inferstructor Dashboard | xxxstar · master · `apps/inferstructor-dashboard` | Source present; dedicated-host deployment unverified |
| `studio.dotx3.net` | X3 Studio | xxxstar · master · `apps/x3-studio` | Source present; dedicated-host deployment unverified |
| `ide.dotx3.net` | Super IDE | xxxstar · master · `apps/super-ide` | Source present; dedicated-host deployment unverified |
| `intelligence.dotx3.net` | X3 Intelligence | xxxstar · master · `apps/x3-intelligence` | Source present; dedicated-host deployment unverified |
| `swarm.dotx3.net` | Atomic Star OS / Swarm Command | xxxstar · master · `apps/tauri-os` | Source present; dedicated-host deployment unverified |
| `explorer.dotx3.net` | Chain Explorer | xxxstar · master · `apps/explorer` | Source present; dedicated-host deployment unverified |
| `wallet.dotx3.net` | X3 Wallet | xxxstar · master · `apps/wallet` | Source present; dedicated-host deployment unverified |
| `dashboard.dotx3.net` | X3 Dashboard | xxxstar · master · `apps/dashboard` | Source present; dedicated-host deployment unverified |
| `chain-dex.dotx3.net` | Legacy X3 chain DEX | xxxstar · master · `apps/dex` | Separate Next.js frontend source |
| `chain.dotx3.net` | X3 chain ecosystem frontend | xxxstar · master · `x3fronend` | Next.js frontend source |
| `store.dotx3.net` | X3 App Store | xxxstar · master · `x3-app-store/frontend` | Static/frontend prototype source |
| `grants.dotx3.net` | Funding Swarm Ledger | xxxstar · master · `site/funding-swarm.html` | Standalone HTML frontend |

## Branch variants

| Proposed hostname | Frontend | Source | Readiness |
| --- | --- | --- | --- |
| `portal.dotx3.net` | Recovered X3 Portal | xxxstar · mission/resurrection-phase-a · `apps/x3-portal` | Branch-only Next.js frontend source |
| `atlas.dotx3.net` | Atlas Desktop | xxxstar · fix/automation-events-api · `apps/atlas-desktop` | Branch-only Vite/Tauri frontend source |

## Website route aliases

| Proposed hostname | Frontend | Source | Readiness |
| --- | --- | --- | --- |
| `docs.dotx3.net` | Documentation | dotx3 · main · `src/routes/docs.tsx` | Existing website route; separate host not configured |
| `language.dotx3.net` | Language overview | dotx3 · main · `src/routes/language.tsx` | Existing website route; separate host not configured |
| `bootcamp.dotx3.net` | Developer Bootcamp | dotx3 · main · `src/routes/bootcamp.tsx` | Existing website route; separate host not configured |
| `playground.dotx3.net` | Editable .x3 playground | dotx3 · main · `src/routes/playground.tsx` | Existing website route; separate host not configured |
| `labs.dotx3.net` | Compiler and integrated labs | dotx3 · main · `src/routes/labs.tsx` | Existing website route; separate host not configured |
| `near.dotx3.net` | NEAR competition hub | dotx3 · main · `src/routes/near.tsx` | Existing website route; separate host not configured |
| `security.dotx3.net` | AI Security & Defense track | dotx3 · main · `src/routes/security.tsx` | Existing website route; separate host not configured |
| `agents.dotx3.net` | Agent Economy track | dotx3 · main · `src/routes/agents.tsx` | Existing website route; separate host not configured |
| `defi.dotx3.net` | Unstoppable DeFi track | dotx3 · main · `src/routes/defi.tsx` | Existing website route; separate host not configured |
| `demo.dotx3.net` | Payment demonstration | dotx3 · main · `src/routes/demo.tsx` | Existing website route; separate host not configured |
| `developers.dotx3.net` | Developer/source guide | dotx3 · main · `src/routes/developers.tsx` | Existing website route; separate host not configured |
| `proof.dotx3.net` | Evidence walkthrough | dotx3 · main · `src/routes/proof.tsx` | Existing website route; separate host not configured |
| `proofs.dotx3.net` | Proofs route | dotx3 · main · `src/routes/proofs.tsx` | Existing website route; separate host not configured |
| `back.dotx3.net` | Support/backing page | dotx3 · main · `src/routes/back.tsx` | Existing website route; separate host not configured |

## Standalone lab frontends

| Proposed hostname | Frontend | Source | Readiness |
| --- | --- | --- | --- |
| `shield.dotx3.net` | Signed-quote demonstration | dotx3 · feat/x3lang-integrated-labs-20261111 · `public/labs/guard/index.html` | Static browser frontend source |
| `judge.dotx3.net` | Judge / policy-test console | dotx3 · feat/x3lang-integrated-labs-20261111 · `public/labs/guard/judge.html` | Static browser frontend source |
| `bnb.dotx3.net` | BNB readiness demonstration | dotx3 · feat/x3lang-integrated-labs-20261111 · `public/labs/guard/bnb.html` | Static browser frontend source |
| `attack.dotx3.net` | Offline Attack Lab | dotx3 · feat/dotx3-learning-labs · `public/labs/attack/attack-lab.html` | Standalone browser frontend source |

## Operator frontends

| Proposed hostname | Frontend | Source | Readiness |
| --- | --- | --- | --- |
| `gpu.dotx3.net` | GPU Swarm Admin | xxxstar · master · `crates/gpu-swarm/static/index.html` | Local admin UI source |
| `validator-metrics.dotx3.net` | Multi-chain GPU validator dashboard | xxxstar · master · `infra-structure/validator/dashboard` | Static telemetry frontend source |
| `tps.dotx3.net` | Blockchain TPS service frontend | xxxstar · master · `infra-structure/services/blockchain-tps/public` | Service-backed HTML frontend source |
| `proof-forge.dotx3.net` | ProofForge Dashboard | xxxstar · master · `public/index.html` | Standalone HTML dashboard source |

## Legacy HTML prototypes

| Proposed hostname | Frontend | Source | Readiness |
| --- | --- | --- | --- |
| `legacy-blockchain-stress-test.dotx3.net` | Blockchain Stress Test | xxxstar · master · `production/public/blockchain-stress-test(1).html; production/public/blockchain-stress-test.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-chainbench-pro.dotx3.net` | Chainbench Pro | xxxstar · master · `production/public/chainbench-pro.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-chainbench-ultimate.dotx3.net` | Chainbench Ultimate | xxxstar · master · `production/public/chainbench-ultimate(1).html; production/public/chainbench-ultimate.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-renderer-shell.dotx3.net` | Renderer Shell | xxxstar · master · `production/public/index.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-test-rpc-connection.dotx3.net` | Test Rpc Connection | xxxstar · master · `production/public/test-rpc-connection.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-cuool.dotx3.net` | Cuool | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3-cuool.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-ecosystem.dotx3.net` | Ecosystem | xxxstar · master · `production/public/x3-ecosystem(1).html; production/public/x3-ecosystem.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-flashloans.dotx3.net` | Flashloans | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3-flashloans.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-landing.dotx3.net` | Landing | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3-landing.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-nexus.dotx3.net` | Nexus | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3-nexus.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-technical.dotx3.net` | Technical | xxxstar · master · `production/public/x3-technical.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-validators.dotx3.net` | Validators | xxxstar · master · `production/public/x3-validators.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-admin-dashboard.dotx3.net` | Admin Dashboard | xxxstar · master · `production/public/x3star-admin-dashboard.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-affiliate.dotx3.net` | Affiliate | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-affiliate.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-arbitrage-engine.dotx3.net` | Arbitrage Engine | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-arbitrage-engine.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-barter-exchange.dotx3.net` | Barter Exchange | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-barter-exchange.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-benchmark-page.dotx3.net` | Benchmark Page | xxxstar · master · `production/public/x3star-benchmark-page.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-bounty-board.dotx3.net` | Bounty Board | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-bounty-board.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-competitor-annihilation.dotx3.net` | Competitor Annihilation | xxxstar · master · `production/public/x3star-competitor-annihilation.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-competitor-graveyard.dotx3.net` | Competitor Graveyard | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-competitor-graveyard.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-compute-marketplace.dotx3.net` | Compute Marketplace | xxxstar · master · `production/public/x3star-compute-marketplace.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-dashboard.dotx3.net` | Dashboard | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-dashboard.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-ecosystem-heartbeat.dotx3.net` | Ecosystem Heartbeat | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-ecosystem-heartbeat.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-fundraise-thermometer.dotx3.net` | Fundraise Thermometer | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-fundraise-thermometer.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-governance.dotx3.net` | Governance | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-governance.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-grant-hub.dotx3.net` | Grant Hub | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-grant-hub.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-grant-mission-control.dotx3.net` | Grant Mission Control | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-grant-mission-control.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-hall-of-fame.dotx3.net` | Hall Of Fame | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-hall-of-fame.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-if-you-had.dotx3.net` | If You Had | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-if-you-had.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-if-you-invested.dotx3.net` | If You Invested | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-if-you-invested.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-home.dotx3.net` | Home | xxxstar · master · `production/public/x3star-index.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-investor-relations.dotx3.net` | Investor Relations | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-investor-relations.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-kyc-onboarding.dotx3.net` | Kyc Onboarding | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-kyc-onboarding.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-star-landing.dotx3.net` | Star Landing | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-landing.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-leaderboard-arena.dotx3.net` | Leaderboard Arena | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-leaderboard-arena.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-mission-terminal.dotx3.net` | Mission Terminal | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-mission-terminal.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-network-pulse.dotx3.net` | Network Pulse | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-network-pulse.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-node-health.dotx3.net` | Node Health | xxxstar · master · `production/public/x3star-node-health.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-operator-war-room.dotx3.net` | Operator War Room | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-operator-war-room.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-portfolio.dotx3.net` | Portfolio | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-portfolio.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-proof-wall.dotx3.net` | Proof Wall | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-proof-wall.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-roi-calculator.dotx3.net` | Roi Calculator | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-roi-calculator.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-scarcity-clock.dotx3.net` | Scarcity Clock | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-scarcity-clock.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-slot-tracker.dotx3.net` | Slot Tracker | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-slot-tracker.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-social-proof-wall.dotx3.net` | Social Proof Wall | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-social-proof-wall.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-spine.dotx3.net` | Spine | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-spine.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-staking.dotx3.net` | Staking | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-staking.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-tech-deep-dive.dotx3.net` | Tech Deep Dive | xxxstar · master · `production/public/x3star-tech-deep-dive.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-token-presale.dotx3.net` | Token Presale | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-token-presale.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-tokenomics-warroom.dotx3.net` | Tokenomics Warroom | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-tokenomics-warroom.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-transparency-ledger.dotx3.net` | Transparency Ledger | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-transparency-ledger.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-validator-presale.dotx3.net` | Validator Presale | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-validator-presale.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-whale-tracker.dotx3.net` | Whale Tracker | xxxstar · codex/x3-economic-safety-kernel · `production/public/x3star-whale-tracker.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-whitepaper.dotx3.net` | Whitepaper | xxxstar · master · `production/public/x3star-whitepaper.html` | HTML prototype only; no deployment or service functionality verified |
| `legacy-site.dotx3.net` | Archived static dotx3 website | dotx3 · claude/frontend-gallery · `artifacts/dotx3-site/index.html` | Archived static export |

## Placeholder-only reservations

| Proposed hostname | Frontend | Source | Readiness |
| --- | --- | --- | --- |
| `ai.dotx3.net` | Ai | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `chat.dotx3.net` | Chat | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `social.dotx3.net` | Social | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `trading.dotx3.net` | Trading | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `adult.dotx3.net` | Adult | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `crypto.dotx3.net` | Crypto | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `blockchain.dotx3.net` | Blockchain | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `testnet.dotx3.net` | Testnet | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `marketplace.dotx3.net` | Marketplace | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `pool.dotx3.net` | Pool | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `infura.dotx3.net` | Infura | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `validator.dotx3.net` | Validator | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `testing.dotx3.net` | Testing | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `test.dotx3.net` | Test | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `blockexplorer.dotx3.net` | Blockexplorer | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `xplorer.dotx3.net` | Xplorer | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `xxx.dotx3.net` | Xxx | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `cam.dotx3.net` | Cam | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `casino.dotx3.net` | Casino | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `blog.dotx3.net` | Blog | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `xxxchange.dotx3.net` | Xxxchange | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `pics.dotx3.net` | Pics | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |
| `vibecode.dotx3.net` | Vibecode | xxxstar · master · `infra/x3star-subdomains/server.js` | Coming Soon placeholder; standalone application not established |

## Scope and exclusions

- dotx3: 11 remote branches; routes, DEX integration, static gallery/game and lab assets.
- xxxstar: 298 current remote branches; app manifests and HTML frontend entries across frontend-bearing trees. Branch-only recovered pages are preserved in the legacy list.
- x3-world: 5 remote branches; Quantum Kernel Voyager and the Cosmic Lizard experiment.
- Gallery screenshots establish appearance only. Its ten app bundles are not tracked in dotx3 and require a source build.
- The Kitchen Dilemma is a meal planner, not a game. Quantum Kernel Voyager is a 3D interface; this inventory does not certify it as a completed game.
- Backend services, SDKs, adapters, test packages, error pages, platform helpers and repeated `(1)` copies are not separate application deployments.
- `phase5_panel` and `infra-structure/dashboard` carry deprecation notices pointing to desktop/OS-shell panels, so their canonical hostnames are used instead of duplicating them.
- The supplied audit describes an older commit (`2391a45`). It was used as context, not treated as a current deployment check or an instruction to execute its remediation list.
