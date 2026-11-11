# dotx3 handoff — 2026-11-11

## Current work

The documentation and NEAR competition updates are on `docs/dotx3-near-tracks` in [draft PR #7](https://github.com/Cyptopimpinainteazy/dotx3/pull/7). Main was inspected at `2391a45`. The bootcamp, playground, DEX and gallery changes previously described here are already in that base; do not try to merge them a second time.

- `/near` links the AI Security & Defense, Agent Economy and Unstoppable DeFi pages.
- `/docs`, `/language`, `/bootcamp` and [the writing guide](X3_GUIDE.md) describe syntax, tooling and execution boundaries.
- `/labs` connects the existing .x3 learning tools and the offline Attack Lab imported from the integrated-labs branch. Its copied-file hashes and source revision are public at `/labs/attack/provenance.json`.
- The Attack Lab previews native-test-NEAR vault rules. It is distinct from the Solana-USDC mandate in the .x3 playground; its browser ledger is not a deployed vault.

## Verification and deployment

See `audit-artifacts/dotx3-docs-20261111/` for local verification and deployment evidence. The first source commit passed 197 script tests and 77 TypeScript tests, typecheck, production build, desktop/mobile route checks and the interactive bootcamp smoke; GitHub Site checks also passed. These are results for the named source commit, not perpetual pass counts.

Vercel CLI 65.14.0 and official MCP OAuth are authenticated. The checkout is linked to project `dotx3`. The verified preview is protected by Vercel authentication. `command.dotx3.net` is assigned but still needs its Cloudflare TXT/CNAME records; [deployment instructions](DEPLOYMENT.md) record the returned values. Production has not been promoted and PR #7 remains draft.

## Maintaining the site

Keep the website and X3Lang source repositories distinct in install commands. Update browser vendors from a pinned source revision with provenance and parity tests. Never replace historical execution artifacts or present a local preview as on-chain enforcement. Contract names in historical receipts remain unchanged.

The full compiler-API portion of `feat/x3lang-integrated-labs-20261111` landed concurrently through PR #1 and is preserved in this branch. Its real Python function, source fixtures and static labs are integrated; local and Vercel verification of the combined source are recorded separately. The offline Attack Lab does not depend on that API. See [the branch assessment](BRANCH_ASSESSMENT.md).
