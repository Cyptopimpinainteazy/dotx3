# Branch assessment — 2026-11-11

Assessed fetched dotx3 refs against main `2391a453d656c83696ad79ad02bf3d0ed4d1b767`. A branch title is not execution evidence.

| Branch                                          | Head    | Reuse decision                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| main / hackathon/near-2026                      | 2391a45 | Same commit. Use as the integration base for all three track pages.                                                                                                                                                                                                                                    |
| feat/x3-bootcamp                                | 02139ac | Already merged. Reuse the source-backed course for every track's language onboarding.                                                                                                                                                                                                                  |
| claude/playground-language-backers              | e933c5b | Already merged through the integration history. Reuse local policy verdicts for Security and Agent Economy.                                                                                                                                                                                            |
| feat/dotx3-dex                                  | a3da771 | Already merged. Reuse read-only markets as DeFi context; they are not settlement proof.                                                                                                                                                                                                                |
| claude/frontend-gallery                         | e80d7dc | Gallery work is present in main. Presentation material is not a new track proof.                                                                                                                                                                                                                       |
| feat/x3lang-integrated-labs-20261111            | 520c723 | Adds a vendored Python compiler API, Guard and attack labs, source provenance and API tests. Candidate for deeper interactive learning; requires separate Python/Vercel build and request-boundary verification before integration. Do not merge generated-output deletions as a documentation update. |
| dependabot/npm_and_yarn/npm_and_yarn-11c2e24550 | 6545368 | Dependency/security work; not additional track functionality.                                                                                                                                                                                                                                          |

## Track selection

Security uses the merged policy checker and existing historical Guard refusals. Agent Economy uses the same owner's mandate and agent-payment examples. DeFi uses the historical source-hash-bound Base Sepolia → NEAR testnet transfer and its two-chain records. These are three explanations of shared components, not three independent settlement engines.

The integrated-labs branch deserves its own implementation review; this assessment does not claim its compiler API has been deployed or tested here. The current work updates documentation and track navigation without changing signing, custody or settlement code.

## Integration update

PR #1 landed on main at `c0591db0074d941aa0a74e1e6bce8f5fd24540f9` after compiler API/provenance, Node, build, typecheck and DEX CI passed. This track-pages branch now includes that main commit, preserving `/labs`, `/dex` and `/bootcamp`. The earlier table is a historical assessment, not the current merge queue. Production compiler execution remains separately unverified.
