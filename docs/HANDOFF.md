# Handoff: where things stand (2026-11-11)

Everything below is pushed. Pick up from here.

## Open pull requests

| PR | Branch | What | Status |
|---|---|---|---|
| #3 | `claude/playground-language-backers` | `/playground` (real X3 checker in the browser, 12 scenarios, 9 attacks, 1Click quote signature check), `/language`, `/back` (LP onboarding, investors, milestones), fix for the mandate missing `refund_to` | Open, mergeable. `npm run test:x3` 17/17 |
| #5 | `claude/frontend-gallery` (stacked on #3) | `public/gallery/`: X3 Frontend Gallery + MEME COIN BLAST, `scripts/build-gallery.sh` | Open |

Merge #3 first if you want it live before the NEAR deadline (Nov 14 23:59 UTC).

## Gallery

- After merge: `dotx3.net/gallery/` (screenshots) and `dotx3.net/gallery/arcade/meme-coin-blast.html` (the game). Nothing in the site nav links to them, so the hackathon pages stay focused.
- Live apps: `scripts/build-gallery.sh` clones xxxstar and x3-world, builds 10 Vite apps into `public/gallery/apps/` (gitignored, because xxxstar is private and this repo is public), applies two hosting patches and a secret scan. With the apps present, the same gallery page opens them for real.
- Not built yet: Explorer, DEX and Wallet (Next.js, need `output: "export"` or a server), and the bare Dashboard shell.
- MEME COIN BLAST is a rebuild; the original code was not in any repo or saved chat. Play credits only, simulated prices, made-up coin names.

## Decided

- Naming map (for reference, not applied in code yet): Dotx3 brand, .x3 language, X3 Force security product, Team Six Security (AI agents), X3 General (enforcement contract, public name replacing X3 Guard), plus High Command, Radar, Phantom, Armory, Recon, Proving Ground and the `*.dotx3.net` subdomains. Deployed contracts and evidence still say `x3-guard`: write "X3 General (formerly X3 Guard)" once wherever judges follow links.

## Next, in order

1. **Home page meter:** replace the $100B dollar goal with a proof meter (0/6) driven by the six milestones on `/back`. A dollar goal on a page that takes no money reads like a raise.
2. **`TOKEN` in `src/lib/front-door.ts`:** fill `contract`, `deployTx`, `rheaPoolId`, `poolTx` only from finalized transactions. `/back` flips each row to Live by itself. Talk to a lawyer before launching the token or taking investor money.
3. **NEAR Intents Shield incidents (x3lang):** before Guard accepts a quote, `GET https://shield.chaindefuser.com/incident` and refuse on any active incident matching the route's chain, bridge, token (`nep141:…`) or deposit address; refuse if the endpoint is unreachable or the answer doesn't parse. Needs a partner JWT with `key_type: SHIELD` from partners.near-intents.org/api-keys. Mirror it in the playground with tests.
4. **Guard enforces `program_sha256`** in `agent_accept_quote` (the Tidepool Guard already does). Listed as "Next" on `/language`.
5. Existing test debt, not from these PRs: 8 failing `scripts/grok-pwa-plugin` tests stop `npm test` early; one `no-empty` lint in `src/lib/app-data/client.server.ts`.
