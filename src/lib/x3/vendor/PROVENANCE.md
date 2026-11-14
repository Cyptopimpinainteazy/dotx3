# Vendored from X3Lang

These six files are byte-for-byte copies of
[Cyptopimpinainteazy/x3lang](https://github.com/Cyptopimpinainteazy/x3lang/tree/184b6d17f61bd576eee34f6cad25b9e4256aa29e)
at commit `184b6d17f61bd576eee34f6cad25b9e4256aa29e`, reviewed November 13, 2026. Since the previous
port (`efb514f`, November 12) only `x3guard.mjs` changed upstream: x3lang #242 (issue #241)
carries `bps` through the parser and refuses slippage bounds without a unit.
They are MIT licensed; the license is copied beside them.

Upstream now includes the exact-boolean binding between the request and the
provider-signed `dry` field. The playground and static Guard lab use identical
checker bytes; no local correction to this module is needed at this revision.
The compiler and static-lab port are recorded separately in `x3lang-port.json`.
`src/lib/x3/x3.test.ts` checks all six output hashes below and replays the scenarios.

`judge/scenarios.json` is a historical local-policy fixture, evaluated at the
`evaluated_at` timestamp inside the file. Its examples, recorded outcomes and
track-guide prose are upstream fixture data, not current settlement evidence.
Current mainnet claims and transaction links are presented on `/proof`.

| File here | Source path in x3lang | SHA-256 |
|---|---|---|
| `x3guard.mjs` | `x3-lang/near/demo/x3guard.mjs` | `0b8991f2f2ad9d08a5bec81c05d0ee1bf6dbb8648fdff59cb60e0183a99881ea` |
| `judge/judge.mjs` | `x3-lang/near/demo/judge/judge.mjs` | `523b8e117fff2fcf8034d6a110d932cafe211974fb12e60af951c284ffdc6d92` |
| `judge/scenarios.json` | `x3-lang/near/demo/judge/scenarios.json` | `ee0c2d3d5019bd7e032666b9ac930d58fd9b5dbb63d44a329b92ebaa5daa6d06` |
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
