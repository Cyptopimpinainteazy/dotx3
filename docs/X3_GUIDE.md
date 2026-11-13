# Writing .x3

`.x3` is a source-file extension for X3Lang. On the NEAR path it expresses owner spending rules and agent payment requests as typed, deterministic input. dotx3 is the documentation and demo website; the [X3Lang repository](https://github.com/Cyptopimpinainteazy/x3lang) contains the executable Python frontend, contracts, tests and evidence. The separate Rust/X3BC runtime path must not be conflated with NEAR execution.

## Current execution evidence

Reviewed November 12, 2026 against [X3Lang `efb514ffef2cdfdeb8ad8147747887c85356073c`](https://github.com/Cyptopimpinainteazy/x3lang/commit/efb514ffef2cdfdeb8ad8147747887c85356073c): the [invoice_06 mainnet archive](https://github.com/Cyptopimpinainteazy/x3lang/blob/efb514ffef2cdfdeb8ad8147747887c85356073c/evidence/near-guard-mainnet-invoice06-2026-11-12/README.md) records a restricted agent key accepting a signed live 1Click quote on NEAR after 21 passing checks. A separate Solana wallet deposited 25.000000 USDC, and 24.995200 USDC was delivered to `x3lang.near`. The public observer reports 18 passed checks, zero failures and one fact unreadable on chain.

That record proves a restricted NEAR authorization and the two finalized transfer legs. Guard did not hold or move the USDC. The 1Click status record associates the deposit with the payout; cryptographic cross-chain causality is not established. The funding wallet's controller is unconfirmed. The original mandate and payment `.x3` files have not been matched to the two stored hashes, and Guard's settlement outcome remains unset. The language examples below are checked-in teaching examples, not the claimed source of invoice_06.

## Two files, two responsibilities

An owner **mandate** defines owner and agent identities, spending asset, payment and rolling daily caps, recipient and output-asset allowlists, refund address, fee/slippage ceilings, approval threshold and expiry. The agent's **intent** states source asset and amount, destination asset and recipient, one supported NearIntents bridge leg, minimum output, mandate reference, unused nonce and timeout/refund behavior.

Copy complete examples from `x3-lang/examples/near_mandate_agent.x3` and `near_intents_agent_payment.x3` in X3Lang. Website snippets explain syntax; the source files are authoritative. Example account names are placeholders.

## Write the owner mandate

Save this as `owner.x3`. The example identities are placeholders. This is the complete checked-in example at X3Lang revision `e12b4c8`; choosing your own identities does not itself create accounts or sign a mandate.

```text
mandate x3_shopping_agent {
    owner x3-owner.near
    agent x3-agent.near
    spend Solana.USDC
    per_payment 50000000
    per_24h 200000000
    allow recipients x3-demo.near
    allow assets Near.USDC
    refund_to 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD
    require slippage <= 1%
    require fees <= 100 bps
    approve above 30000000 by 1 of x3-owner.near
    expires 30d
}
```

## Write the agent's request

Save this as `payment.x3`. It requests 25 USDC, below the 30 USDC approval threshold, and names the owner's mandate. The compiler resolves the omitted timeout refund recipient from the source receiver; the mandate still requires that result to match `refund_to`.

```text
intent near_intents_agent_payment {
    from Solana.USDC amount 25000000 receiver 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD
    to Near.USDC receiver x3-demo.near
    route {
        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;
    }
    under mandate x3-owner.near
    require slippage <= 0.5%
    require fees <= 100 bps
    require nonce unused agent_payment_001
    timeout 10m refund Solana.USDC
    on_fail rollback
}
```

| Clause                    | Meaning                                 | What to change deliberately                                   |
| ------------------------- | --------------------------------------- | ------------------------------------------------------------- |
| `owner` / `agent`         | Policy authority and agent identity     | Accounts you control and the intended signer role             |
| `spend`, `from`, `to`     | Asset and chain identifiers             | Registry-supported identifiers and actual token decimals      |
| `allow recipients`        | Destination allowlist                   | The exact intended recipient, not model-selected alternatives |
| `per_payment` / `per_24h` | Payment and rolling daily limits        | Integer units within the owner's budget                       |
| `under mandate`           | Bind the payment to the owner policy    | Match the owner in the mandate                                |
| `min_receive`             | Minimum destination token units         | A bound you reviewed, not the quoted output alone             |
| `require nonce unused`    | One-use payment identity                | A fresh identifier for each intended payment                  |
| `timeout` / `on_fail`     | Deadline and supported failure handling | Origin-chain refund terms supported by the adapter            |

For a learning exercise, change only `to Near.USDC receiver x3-demo.near` to `to Near.USDC receiver attacker.near`. The syntax remains valid; the owner policy must refuse the new recipient. Removing the nonce produces a compiler refusal instead. Use `/bootcamp` or `/playground` to see these two kinds of failure.

## Units and bounds

Amounts are integers in token base units: for six-decimal USDC, `25000000` is 25 USDC and `50000000` is 50 USDC. Confirm decimals and supported asset identifiers in the selected token registry. `100 bps` is 1%. An approval threshold does not override a cap. An agent cannot approve itself. Use a fresh nonce per payment; changing a nonce does not authorize a forbidden recipient. Compilation resolves relative mandate expiry, so retain the compiled terms and evaluation time when reproducing results.

## Run an offline policy check

Run these commands from a checkout of **X3Lang**, not dotx3:

```sh
git clone https://github.com/Cyptopimpinainteazy/x3lang.git
cd x3lang
git checkout efb514ffef2cdfdeb8ad8147747887c85356073c
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

Use `/bootcamp` for the course, `/playground` for browser-local experiments, and `/near` for the three track perspectives. [The judge guide at the reviewed revision](https://github.com/Cyptopimpinainteazy/x3lang/blob/efb514ffef2cdfdeb8ad8147747887c85356073c/docs/hackathon/JUDGE_GUIDE.md) separates local checks, Guard transactions and delivery. The historical Base Sepolia → NEAR transfer used a trusted Tidepool relay. The official 1Click mainnet settlement is recorded separately in the invoice_06 archive above. Neither record establishes cryptographic cross-chain atomicity.

From the pinned X3Lang checkout, refresh the mainnet observations without signing or sending funds:

```sh
python3 scripts/hackathon/observe_mainnet_invoice06.py --out /tmp/x3-invoice06-observation.json
```

The observer needs public RPC access. Compare transaction records with the archived [observation](https://github.com/Cyptopimpinainteazy/x3lang/blob/efb514ffef2cdfdeb8ad8147747887c85356073c/evidence/near-guard-mainnet-invoice06-2026-11-12/public-rpc-observation.json) and [checksum](https://github.com/Cyptopimpinainteazy/x3lang/blob/efb514ffef2cdfdeb8ad8147747887c85356073c/evidence/near-guard-mainnet-invoice06-2026-11-12/SHA256SUMS). Current balances, key allowances and final blocks can change. A local preview, a signed quote and a successful Guard call each establish less than a finalized transfer.
