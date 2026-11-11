# Bootcamp developer portal

Route: `/bootcamp`. The primary learning navigation and the docs, language and developer pages link to it.

The 12-lesson curriculum in `src/lib/bootcamp/lessons.ts` covers the NEAR intent/mandate adapter separately from the Rust compiler/local VM. `reference.json` pins four verbatim source examples and a refusal index extracted from literal X3 error calls in cli.py, near_intents.py and near_mandate.py at `3b6c73037a1cb158f79c5f76d3ee202c4376f8d4`. It is not an exhaustive catalog of Rust diagnostics or contract errors. Every lesson and refusal links to its source revision.

The editable browser lab uses the existing, unmodified vendored checker at `470d61a3b77689bb5e0c7e36fc7814d28e761dad`. It freezes the scenario clock and uses captured tokens, no spends and no revocation. A local pass is not live authorization, replay protection, wallet enforcement or settlement. No network quote or transaction is invoked by the course.

Progress is self-assessed and saved only in the current browser. No accounts, database or credentials are added.

Validation:
- `npm test`, `npm run typecheck`, `npm run build`.
- `node scripts/bootcamp-smoke.mjs http://127.0.0.1:18084/bootcamp` against a local preview (Playwright/Chromium required). Checks policy pass, recipient denial, missing nonce, invalid mandate, stale-result clearing, progress persistence, search, example download and mobile navigation.
- Desktop/mobile smoke of both development and production build. Wait for `[data-bootcamp-ready="true"]` before taking screenshots so screenshot caret styling cannot race React hydration.
- Offline parser, plan and mandate-check examples executed against the curriculum revision with the saved scenario token catalog. Rust commands are sourced from the pinned programming guide; this change does not claim a new Rust build or chain execution.
