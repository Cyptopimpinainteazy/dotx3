export const SITE = "dotx3.net";

export const REPO = "https://github.com/Cyptopimpinainteazy/x3lang";
export const RAW = "https://github.com/Cyptopimpinainteazy/x3lang/blob/master";

/** Reviewed repository snapshot. A passing run here covers this commit, not a future branch tip. */
export const EVIDENCE_SNAPSHOT = {
  commit: "4f60ddb652188784ed44f64d8172cd2cd84da422",
  checkedAt: "2026-11-13T06:12:37Z",
  dateLabel: "November 13, 2026",
  ciRun: `${REPO}/actions/runs/43376851817`,
  checksPassed: 4,
} as const;

/**
 * The X3Lang revision the browser compiler and labs were vendored from. Kept separate from
 * EVIDENCE_SNAPSHOT: efb514f..4f60ddb adds evidence files only, and the vendored bytes are
 * pinned to this commit by scripts/attack-lab.test.mjs. Re-vendor before changing it.
 */
export const VENDOR_SNAPSHOT = { commit: "efb514ffef2cdfdeb8ad8147747887c85356073c" } as const;

const PINNED = `${REPO}/blob/${EVIDENCE_SNAPSHOT.commit}`;
const MAINNET_BUNDLE = `${PINNED}/evidence/near-guard-mainnet-invoice06-2026-11-12`;

/** Historical mainnet observation, not a live balance or an executable quote. */
export const MAINNET = {
  amountIn: "25.000000",
  amountOut: "24.995200",
  owner: "x3lang.near",
  agent: "x3-agent.x3lang.near",
  nonce: "mainnet_demo_nov11_invoice_06",
  guardChecks: 21,
  observedAt: "2026-11-12 21:15 UTC",
  observationSha256: "3e04b9fd801473a52c1f51460c406752ef898877c80bda920c32c8ddb3348be7",
  quoteHash: "8ynPgyqDugkyL2gicfUuTtymMjTPQzcRMBjj4RKgKeSD",
  approvalTx: "GFdQLrzT5tnPPdZwKLtmwpNvSwrxVHDvVg2C3WX5fsK6",
  guardTx: "Eg75uehwU4YJ86ZZPEPKiBqnjkr6PxwPmV23HFAgu153",
  depositTx:
    "4zhGYyWNabYQ5gixTUzoVHVbgFKWAsQssSpCv3B1J1LjCRisEJW6wm3zuS2GVuDotAT93S8wm1qezHwsKX2RkXo5",
  payoutTx: "8jfbACLSxrzi3fnajfAVGc4Fgo6XLCWA1mpiJWXPw43P",
  outcomeTx: "9sTn9pJ1ZbCVazBm9Wz9oEDh6aWw4FUVMoAJEKCCzuqE",
  /** SHA-256 of the recovered .x3 files; equal to the hashes Guard stores (get_intent / get_mandate). */
  paymentSha256: "9ee29a5603cfa1e7d9fdbd866cf330ce35e6b5f0907c6844dd2ef1a213768ba0",
  mandateSha256: "eea021d5cc1118801f4e1d3b9c0efe89fc59a7f654031f9ff1951aa1f2f3d515",
  guardCodeHash: "BPdpJAw8R4SDh6Wi7dPcXTs5T7ncJDVKCLgzuqZFb15T",
  /** The key that signed every agent call: FunctionCall, three Guard methods on x3lang.near. */
  agentFunctionCallKey: "ed25519:J3NiU8J63HAfz2MTDu1zQVhFRYS5Pio21h1kNtJdP11x",
  /** Owner recovery key that is still on the agent account. It signed none of these calls. */
  agentFullAccessKey: "ed25519:8teaXGYFELKQN5QA7gQqeA4B7URrcMQqaczZ5D68c23u",
  fundingWallet: "58tbMfadmi8HWzUndLqkX3prBbkiZMEaYMTDYSzhB3cQ",
} as const;

/**
 * What invoice_06 does not prove. Shown wherever the mainnet record is, so the receipt never
 * appears without its limits. Each line is stated in the x3lang evidence bundle at
 * EVIDENCE_SNAPSHOT.commit.
 */
export const MAINNET_LIMITS = [
  "The owner manually signed the Solana deposit from the funding wallet. First-party records identify it as the owner's; the chain shows the signer, not who controls it.",
  "Guard does not hold or move the USDC. A holder of the funding wallet's key could pay without Guard.",
  "The agent account still has the owner's FullAccess recovery key next to its restricted key. That key signed none of these calls.",
  "The recorded outcome is the agent's report. Guard stores the supplied transaction hashes and checks the amount against the floor; it does not authenticate the hashes.",
  "The Solana deposit and the NEAR payout are linked by 1Click status, timing and amount, not by a cryptographic cross-chain proof.",
  "Guard checks the stored .x3 hashes; it does not compile or run .x3. X3VM is not on the deployed authorization path.",
  "One settlement of about $25. It does not establish production reliability.",
] as const;

export const LINKS = {
  repo: REPO,
  readme: `${REPO}#readme`,
  actions: `${REPO}/actions`,
  issues: `${REPO}/issues`,
  pulls: `${REPO}/pulls`,
  license: `${REPO}/blob/master/LICENSE`,
  security: `${REPO}/blob/master/SECURITY.md`,
  contributing: `${REPO}/blob/master/CONTRIBUTING.md`,
  hackathonDocs: `${REPO}/tree/master/docs/hackathon`,
  examples: `${REPO}/tree/master/x3-lang/examples`,
  mandate: `${RAW}/x3-lang/examples/near_mandate_agent.x3`,
  trade: `${RAW}/x3-lang/examples/base_sepolia_to_near_testnet_1usdc.x3`,
  denied: `${RAW}/x3-lang/examples/near_intents_agent_denied.x3`,
  payment: `${RAW}/x3-lang/examples/near_intents_agent_payment.x3`,
  guardEvidence: `${RAW}/evidence/near-guard-testnet-live-2026-11-06.md`,
  tradeEvidence: `${RAW}/docs/hackathon/FIRST_FINALIZED_SWAP_EVIDENCE.md`,
  mainnetEvidence: `${MAINNET_BUNDLE}/README.md`,
  mainnetObservation: `${MAINNET_BUNDLE}/public-rpc-observation.json`,
  mainnetChecksums: `${MAINNET_BUNDLE}/SHA256SUMS`,
  mainnetObserver: `${PINNED}/scripts/hackathon/observe_mainnet_invoice06.py`,
  mainnetObserverRun: `${REPO}/actions/runs/43307893891`,
  mainnetGuardTx: `https://nearblocks.io/txns/${MAINNET.guardTx}`,
  mainnetDepositTx: `https://solscan.io/tx/${MAINNET.depositTx}`,
  mainnetPayoutTx: `https://nearblocks.io/txns/${MAINNET.payoutTx}`,
  mainnetApprovalTx: `https://nearblocks.io/txns/${MAINNET.approvalTx}`,
  mainnetOutcomeTx: `https://nearblocks.io/txns/${MAINNET.outcomeTx}`,
  mainnetSourceRecovery: `${MAINNET_BUNDLE}/source-recovery/README.md`,
  mainnetPaymentSource: `${MAINNET_BUNDLE}/source-recovery/payment-proposed.x3`,
  mainnetMandateSource: `${MAINNET_BUNDLE}/source-recovery/mandate-proposed.x3`,
  mainnetOutcomeEvidence: `${MAINNET_BUNDLE}/outcome-recording/README.md`,
  mainnetGuardAccount: "https://nearblocks.io/address/x3lang.near",
  mainnetAgentAccount: "https://nearblocks.io/address/x3-agent.x3lang.near",
  currentCi: `${REPO}/commit/${EVIDENCE_SNAPSHOT.commit}/checks`,
  reviewedSource: `${REPO}/tree/${EVIDENCE_SNAPSHOT.commit}`,
  programBindingPr: `${REPO}/pull/202`,
  vaultRunbook: `${PINNED}/docs/hackathon/VAULT_TESTNET_RUNBOOK.md`,
  baseTx:
    "https://sepolia.basescan.org/tx/0x46c21dc305a9271c4e74c6d0734fb50f847a1e53d3cad87976133d66fd6728d9",
  nearPayout: "https://testnet.nearblocks.io/txns/EBEBxJNgV9U5tBFBLj18ZzukgArqwXH5rBsBStFyCm1d",
  refuseTx: "https://testnet.nearblocks.io/txns/AhVBD7oXfwsixBipupjCzuhNdqunjdXJnLz3LXnmfnN8",
  acceptTx: "https://testnet.nearblocks.io/txns/DPJfcRUGk56h8sSsFsDFFgUMQAiyBCtpMuvquF9FvTct",
  dryQuoteTx: "https://testnet.nearblocks.io/txns/3Q7qTZqiRBB6EuhN78Ra5Q5NBqPXDhfuCg2FKW8WoU2q",
  liveQuoteTx: "https://testnet.nearblocks.io/txns/6B6k5kre4mFoBq7RuJNadQgrhEvmgb9WDLepX22CxzUZ",
  deployTx: "https://testnet.nearblocks.io/txns/FJ5voQaArx17QV4TzDLYDq93cuoAVLSRxjcxbswuyE8v",
  baseline: "https://github.com/Cyptopimpinainteazy/x3lang/compare/baseline...master",
  nearDocs: "https://docs.near.org",
  intentsDocs:
    "https://docs.near-intents.org/integration/distribution-channels/1click-api/quickstart",
  hackathon: "https://nearhackathon.com",
  x: "https://x.com/x3starchain",
  telegram: "https://t.me/x3starchain",
  browserDemo: "https://x3-guard.pages.dev",
} as const;

/**
 * Whether the site links to /back (liquidity, investing, backing) from the nav, the home
 * page and the language page. Off while NEAR HACKATHON judging runs so the competition
 * site reads as a technical submission. /back itself stays reachable by URL. Set to true
 * after judging to restore every link.
 */
export const BACKING_LINKS_VISIBLE: boolean = false;

/** MEME COIN BLAST: the fish-table game where an agent plays under an .x3 mandate. */
export const ARCADE_URL = "/gallery/arcade/meme-coin-blast.html";

/**
 * The .X3 token and its liquidity pool. Both are null until they exist on NEAR mainnet.
 * /back shows "not live" for each null field and never invents a value. When the token is
 * deployed and the Rhea pool is created, set these from the finalized transactions.
 */
export const TOKEN: {
  symbol: string;
  standard: string;
  contract: string | null;
  deployTx: string | null;
  rheaPoolId: number | null;
  poolTx: string | null;
} = {
  symbol: ".X3",
  standard: "NEP-141",
  contract: null,
  deployTx: null,
  rheaPoolId: null,
  poolTx: null,
};

export interface Milestone {
  title: string;
  /** What has to be published for this milestone to count. */
  proof: string;
  /**
   * Set only when that proof is public: finalized transactions, a merged PR, a report.
   * The first link is the primary one; the meter shows it, /back shows them all.
   */
  evidence: { label: string; href: string }[] | null;
  /** Concrete remaining work; never counted as completed evidence. */
  nextAction?: string;
  nextHref?: string;
}

export function hasMilestoneEvidence(milestone: Milestone): boolean {
  return Boolean(milestone.evidence?.length);
}

export function getProofSummary(milestones: readonly Milestone[] = MILESTONES) {
  const posted = milestones.filter(hasMilestoneEvidence).length;
  const total = milestones.length;
  const progress = total ? posted / total : 0;
  return { posted, total, progress, percent: Math.round(progress * 100) };
}

/**
 * The milestones backers can watch. /back lists them and the home page meter counts the
 * ones with evidence. A milestone without a public link stays pending.
 */
export const MILESTONES: Milestone[] = [
  {
    title: "Cross-chain testnet transfer authorized by Guard",
    proof:
      "1 test USDC sent on Base Sepolia after Guard approved the exact .x3 program on NEAR testnet; 0.9974 test USDC delivered to x3lang.testnet. Testnet, through a trusted relayer: not atomic, not mainnet.",
    evidence: [
      { label: "Evidence and limits", href: LINKS.tradeEvidence },
      { label: "Base Sepolia transaction", href: LINKS.baseTx },
      { label: "NEAR testnet delivery", href: LINKS.nearPayout },
    ],
  },
  {
    title: "Guard refuses a wrong recipient on testnet",
    proof:
      "x3-guard on NEAR testnet refused an agent payment to attacker.near (mandate_recipient) and registered the same intent paid to the owner's account. Both transactions are final.",
    evidence: [
      { label: "Evidence", href: LINKS.guardEvidence },
      { label: "Refusal transaction", href: LINKS.refuseTx },
      { label: "Allowed transaction", href: LINKS.acceptTx },
    ],
  },
  {
    title: "Scoped agent vault on testnet",
    proof:
      "One allowed payment, plus recorded refusals for over-cap, wrong recipient, 24-hour window and redirected refund.",
    evidence: null,
    nextAction:
      "Publish the allowed payment and all four refusal cases from the public testnet runbook. Local Sandbox tests do not fill this milestone.",
    nextHref: LINKS.vaultRunbook,
  },
  {
    title: "One mainnet 1Click swap through Guard",
    proof:
      "The signed quote, the Guard authorization, the deposit, and the delivery, each with a finalized transaction hash.",
    evidence: [
      { label: "Mainnet evidence and limits", href: LINKS.mainnetEvidence },
      { label: "Guard acceptance", href: LINKS.mainnetGuardTx },
      { label: "25 USDC Solana deposit", href: LINKS.mainnetDepositTx },
      { label: "24.9952 USDC NEAR delivery", href: LINKS.mainnetPayoutTx },
      { label: "Recorded outcome", href: LINKS.mainnetOutcomeTx },
      { label: "Source files matching the stored hashes", href: LINKS.mainnetSourceRecovery },
    ],
  },
  {
    title: "Hostile model refused on mainnet",
    proof:
      "A red-team model's payments go through the same restricted key, and each refusal is on chain with an attack label.",
    evidence: null,
    nextAction:
      "Publish labeled hostile-model attempts through the restricted mainnet key and their on-chain refusals. Current red-team evidence is local.",
  },
  {
    title: "Guard checks the program hash",
    proof:
      "An approved mandate carries only the exact .x3 program the owner saw. Contract tests cover a mismatched hash.",
    evidence: null,
    nextAction:
      "Land reviewed program-hash enforcement with mismatch tests. PR #202 is still open at this snapshot; storing a hash alone does not satisfy this gate.",
    nextHref: LINKS.programBindingPr,
  },
  {
    title: "Independent security review",
    proof: "A published report on Guard and the vault, with every finding and its fix.",
    evidence: null,
    nextAction:
      "Publish an independent review and the disposition of every finding. Internal checks and this evidence review do not count as an independent audit.",
  },
  {
    title: "Tagged release",
    proof:
      "A GitHub release with a checksum and build provenance, so nobody has to trust a branch tip.",
    evidence: null,
    nextAction:
      "Publish a versioned release with checksums and build provenance. A passing branch build is not a release.",
    nextHref: `${REPO}/releases`,
  },
];

export const RHEA_APP = "https://app.rhea.finance";
export const NEAR_WALLETS = "https://wallet.near.org";

export const PROGRAM_SHA = "1398f64e7e208d3796883aa59cb169187c1042ac1af3781bd6efc014755df860";

export const MANDATE = `mandate x3_shopping_agent {
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
}`;

export const TRADE = `intent x3_testnet_base_usdc_to_near {
    from BaseSepolia.USDC amount 1000000 receiver 0x5aF0c1BF95B3A158f6Fc48e3DED35903b2fa0721
    to Near.USDC receiver x3lang.testnet
    route {
        bridge NearIntents BaseSepolia.USDC -> Near.USDC min_receive 980000;
    }
    require slippage <= 1%
    require nonce unused x3_base_testnet_trade_001
    timeout 30m refund BaseSepolia.USDC to 0x5aF0c1BF95B3A158f6Fc48e3DED35903b2fa0721
    on_fail rollback
}`;
