/** Fixed historical mainnet evidence. Never an executable quote or a live balance. */
export const VAULT_PILOT = {
  sourceCommit: "9ec3b48000bcada0ceb20df85d0d7e5eeed744bb",
  date: "November 14, 2026",
  amountIn: "5.000000",
  amountOut: "4.999746",
  minimumOut: "4.974757",
  recipient: "x3lang.near",
  nonce: 1,
  agent: "6R4nioW9tPke3PFuWLaQY3gRAwM5SMi1vbY925WJZtPS",
  program: "68ssmMccnqQFUHWipQKy1W4DcycjA9jip9ZUi7EJyUZn",
  policy: "ATXS8Y9cDVAN3BxTDa7CXt7FuHU7Y6LJHDqGDDuQtXGC",
  vault: "FTToXuCe3RG6L78Ctpno5SL5BpXDNAYc6JnjhjqGWndU",
  quoteDigest: "e53cd55f8ef6b923fe312fa213e6f9f43a0b6d4f230b411f59e58c1589b11b3d",
  approvalTx:
    "4ReKsqwxpwtyx2CNmah6UCkHWgb4GbiJjXGTZLwtHaMMBoWv8vqSki4XXzDrBmqgURJSX7A1fHAKm3jSf3fnWwkV",
  sourceTx:
    "3Bu3eWLwiSLoTNHgLPCzn5JyTAUnfzbXJENQG36oEt7kZm9e1M4rRB5CtUZxG92gRaGmPvuFZUQ1EqBzkL9rdLBf",
  payoutTx: "CXoXgJ5FwcSZcyPDVu7PrNby7KULfY8bJxUBRT9fu4ia",
  sourceSlot: 469314055,
  perPayment: "5 USDC",
  rolling24h: "5 USDC",
  approvalConsumed: true,
  vaultBalance: "0 USDC",
  providerStatus: "SUCCESS",
  codeSha256: "aa96de859a8d29c4e41eece9ff336545f3f99e40c8412f78bc16dd25b562c270",
} as const;

const root = `https://github.com/Cyptopimpinainteazy/x3lang/blob/${VAULT_PILOT.sourceCommit}/evidence/solana-vault-mainnet-2026-11-14`;
export const VAULT_PILOT_LINKS = {
  proof: `${root}/README.md`,
  summary: `${root}/settlement-summary.json`,
  verify: `${root}/verify_archived.py`,
  quote: `${root}/live-quote.near-receipt.json`,
  approval: `https://explorer.solana.com/tx/${VAULT_PILOT.approvalTx}`,
  source: `https://explorer.solana.com/tx/${VAULT_PILOT.sourceTx}`,
  payout: `https://nearblocks.io/txns/${VAULT_PILOT.payoutTx}`,
} as const;

export const VAULT_PILOT_LIMITS = [
  "The owner approved this exact quote before the agent executed it. This is one bounded pilot, not unrestricted autonomous spending.",
  "The Solana policy PDA enforced this transfer. This pilot adds no new NEAR Guard call; the earlier invoice_06 Guard proof is separate.",
  "Finalized source and payout observations used one RPC per chain. Provider SUCCESS links the two legs; cryptographic solver causality and cross-chain atomicity are not proven.",
  "The owner retains upgrade authority. No external contract audit or reproducible source-to-SBF build identity is established by this proof.",
] as const;
