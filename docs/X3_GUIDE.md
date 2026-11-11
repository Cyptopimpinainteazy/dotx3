# Writing .x3

`.x3` is a source-file extension for X3Lang. On the NEAR path it expresses owner spending rules and agent payment requests as typed, deterministic input. dotx3 is the documentation and demo website; the [X3Lang repository](https://github.com/Cyptopimpinainteazy/x3lang) contains the executable Python frontend, contracts, tests and evidence. The separate Rust/X3BC runtime path must not be conflated with NEAR execution.

## Two files, two responsibilities

An owner **mandate** defines owner and agent identities, spending asset, payment and rolling daily caps, recipient and output-asset allowlists, refund address, fee/slippage ceilings, approval threshold and expiry. The agent's **intent** states source asset and amount, destination asset and recipient, one supported NearIntents bridge leg, minimum output, mandate reference, unused nonce and timeout/refund behavior.

Copy complete examples from `x3-lang/examples/near_mandate_agent.x3` and `near_intents_agent_payment.x3` in X3Lang. Website snippets explain syntax; the source files are authoritative. Example account names are placeholders.

## Units and bounds

Amounts are integers in token base units: for six-decimal USDC, `25000000` is 25 USDC and `50000000` is 50 USDC. Confirm decimals and supported asset identifiers in the selected token registry. `100 bps` is 1%. An approval threshold does not override a cap. An agent cannot approve itself. Use a fresh nonce per payment; changing a nonce does not authorize a forbidden recipient. Compilation resolves relative mandate expiry, so retain the compiled terms and evaluation time when reproducing results.

## Run an offline policy check

Run these commands from a checkout of **X3Lang**, not dotx3:

```sh
git clone https://github.com/Cyptopimpinainteazy/x3lang.git
cd x3lang
python3 -m venv .venv
. .venv/bin/activate
pip install -r x3-lang/requirements.txt
PYTHONPATH=x3-lang python3 x3-lang/track_control.py \
  --mandate x3-lang/examples/near_mandate_agent.x3 \
  --intent x3-lang/examples/near_intents_agent_payment.x3 \
  --tokens x3-lang/tests/fixtures/near_intents_tokens.json \
  --at 2026-11-03T03:00:00Z
```

Repeat with `near_intents_agent_denied.x3` to inspect the forbidden-recipient refusal. The approved local preview exits 0, the denied preview exits 6, and invalid input exits 2. This command uses an archived token fixture and does not call RPC, sign, send funds or consume a chain nonce. Its authorization and settlement flags remain unverified.

## What happens after source checking

The frontend parses, type-checks and rejects unsupported terms. On the NEAR integration path, Guard checks signed quote bytes using its pinned manager key and compares the signed values to stored policy. The origin wallet separately funds a deposit, and delivery requires settlement evidence. Guard does not custody swap funds or stop an unrestricted keyholder from transferring outside its methods.

A single-leg NearIntents route cannot promise multi-leg cross-chain atomic rollback. Unsupported guards, mismatched endpoints, missing slippage/deadline/nonce bounds and incompatible refund behaviors must fail closed. Read the current adapter and tests before extending syntax.

## Learn and verify

Use `/bootcamp` for the course, `/playground` for browser-local experiments, and `/near` for the three track perspectives. [The judge guide](https://github.com/Cyptopimpinainteazy/x3lang/blob/master/docs/hackathon/JUDGE_GUIDE.md) separates local checks, Guard transactions and delivery. The historical Base Sepolia → NEAR transfer used a trusted Tidepool relay. It does not establish official funded 1Click mainnet settlement or cryptographic cross-chain atomicity.
