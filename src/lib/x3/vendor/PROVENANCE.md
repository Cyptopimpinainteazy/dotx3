# Vendored from X3Lang

These files originate from
[Cyptopimpinainteazy/x3lang](https://github.com/Cyptopimpinainteazy/x3lang) at commit
`470d61a3b77689bb5e0c7e36fc7814d28e761dad` (2026-11-10, "docs: add evidence-led X3 Shield
showcase (#171)"). They are MIT licensed; the license is copied beside them.

The proposed `x3guard.mjs` copy has one explicit local security correction: require the
request and provider-signed `dry` fields to be actual booleans with identical values.
Its original source SHA-256 is `790e5e5b6a13602f590a9bfebdb0338116fc999da1e773ac3f2368ad8cf5b9c3`.
The identical change in the static lab is recorded as a reproducible local transform in
`x3lang-port.json`. No new upstream commit or deployment is claimed. Re-sync from an
approved upstream fix before retiring this local correction. All other files remain
byte-for-byte pinned copies. `src/lib/x3/x3.test.ts` checks the output hashes below.

| File here | Source path in x3lang | SHA-256 |
|---|---|---|
| `x3guard.mjs` | `x3-lang/near/demo/x3guard.mjs` | `fb577a982124a045b6cfe216144014d8496006bf6ef73cd5148b88e37b5772a9` |
| `judge/judge.mjs` | `x3-lang/near/demo/judge/judge.mjs` | `523b8e117fff2fcf8034d6a110d932cafe211974fb12e60af951c284ffdc6d92` |
| `judge/scenarios.json` | `x3-lang/near/demo/judge/scenarios.json` | `523cb3340c3c8c3a5f084efe86156444f61f9bcbcf67fed6163371a43d20292f` |
| `fixtures/near_intents_quote_dry_live_capture.json` | `x3-lang/tests/fixtures/near_intents_quote_dry_live_capture.json` | `3ca979e678a632b2d5c49c8a3f7098db8072f3329c4e5b54cd265a3e523c0a84` |
| `fixtures/near_intents_quote_dry_implicit_capture.json` | `x3-lang/tests/fixtures/near_intents_quote_dry_implicit_capture.json` | `6ab94fb3d09efe95723c70de9d50c7cf7262fd2be9a5637db24276ebb81d3bb1` |
| `LICENSE` | `LICENSE` | `29e9224adbf45e9e4cfb1b8a0678d4f108560d823d86c400fae1c9192e8b42f4` |

## Why these and not a rewrite

`x3guard.mjs` is the browser port of the Python adapter (`x3-lang/near_intents.py`) and of
the Guard contract's `check_mandate`. In x3lang, `x3-lang/tests/test_demo_parity.py` runs it
and the Python adapter on the same programs and quotes and requires identical results, and
`judge/scenarios.json` carries Python's recorded answer for each of its twelve scenarios.
Copying the module keeps the site on that tested checker instead of a second one that could
drift.

`.d.mts` files beside the modules are written for this site. They give TypeScript the shapes
the pages use, so the vendored JavaScript itself is not type-checked here.
