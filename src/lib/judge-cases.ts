// Judge Console data (from the "Dotx3 — X3 Force Judge Pack" design).
//
// Every hash, block, account and count below was checked against x3lang on 2026-11-12:
//   evidence/near-guard-testnet-live-2026-11-06.md        (refuse/accept txs, blocks, deploy, revoked)
//   docs/hackathon/FIRST_FINALIZED_SWAP_EVIDENCE.md       (two-chain blocks, quote and source hashes)
//   x3-lang/examples/near_intents_agent_denied.x3         (Case 01 program, verbatim)
//   x3-lang/examples/base_sepolia_to_near_testnet_1usdc.x3 (Case 03 program, verbatim)
//   README.md steps 3 and 5                              (9/9 won't-compile, 8/8 red team)
// judge-cases.test.ts pins the shared values to LINKS / PROGRAM_SHA in front-door.ts.
import { LINKS, PROGRAM_SHA, RAW } from "./front-door.ts";

const NB = "https://testnet.nearblocks.io";

export type JudgeCheck = { name: string; detail: string; ok: boolean };
export type JudgeAnchor = { label: string; value: string; href: string };
export type JudgeCase = {
  id: "refused" | "allowed" | "settled";
  kicker: string;
  label: string;
  tone: "bad" | "good";
  lede: string;
  codeTitle: string;
  codeFile: string;
  codeHref: string;
  /** Zero-based line to highlight, or -1. */
  highlight: number;
  code: string[];
  codeNote: string;
  checksTitle: string;
  checks: JudgeCheck[];
  verdict: string;
  verdictLine: string;
  anchors: JudgeAnchor[];
  limit: string;
};

const MANDATE_PASSES: JudgeCheck[] = [
  ["mandate_asset", "Solana.USDC is the allowed spend asset"],
  ["mandate_destination_asset", "Near.USDC is an allowed destination asset"],
  ["mandate_refund_to", "refund address is the owner's, not the agent's"],
  ["mandate_per_payment", "under the per-payment cap"],
  ["mandate_daily", "inside the rolling 24h budget"],
  ["mandate_slippage", "declared slippage within the mandate"],
  ["mandate_fees", "declared fees within the mandate"],
  ["mandate_deadline", "mandate not expired"],
].map(([name, detail]) => ({ name, detail, ok: true }));

export const REFUSE_TX = "AhVBD7oXfwsixBipupjCzuhNdqunjdXJnLz3LXnmfnN8";
export const ACCEPT_TX = "DPJfcRUGk56h8sSsFsDFFgUMQAiyBCtpMuvquF9FvTct";
export const PAYOUT_TX = "EBEBxJNgV9U5tBFBLj18ZzukgArqwXH5rBsBStFyCm1d";
export const BASE_TX = "0x46c21dc305a9271c4e74c6d0734fb50f847a1e53d3cad87976133d66fd6728d9";
export const GUARD_DEPLOY_TX = "Fx7uuvRpQMbpfgyYmCAJiP6Y7RXEB98dYTExBcHKmYRP";

export const JUDGE_CASES: JudgeCase[] = [
  {
    id: "refused",
    kicker: "Case 01 · prompt-injected agent",
    label: "Paid attacker.near → REFUSED",
    tone: "bad",
    lede: "An agent is talked into paying attacker.near. Every other term of the payment is legal, so the model sees nothing wrong. One deterministic rule, mandate_recipient, stops it on chain.",
    codeTitle: "What the hijacked agent wrote",
    codeFile: "examples/near_intents_agent_denied.x3",
    codeHref: `${RAW}/x3-lang/examples/near_intents_agent_denied.x3`,
    highlight: 2,
    code: [
      "intent near_intents_agent_denied {",
      "    from Solana.USDC amount 25000000 receiver 4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD",
      "    to Near.USDC receiver attacker.near",
      "    route {",
      "        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;",
      "    }",
      "    under mandate x3-owner.near",
      "    require slippage <= 0.5%",
      "    require fees <= 100 bps",
      "    require nonce unused agent_denied_001",
      "    timeout 10m refund Solana.USDC",
      "    on_fail rollback",
      "}",
    ],
    codeNote:
      "Repo example of the attack. The live testnet run used the testnet owner and agent accounts shown in the verdict.",
    checksTitle: "X3 General · check_agent_intent",
    checks: [
      ...MANDATE_PASSES,
      { name: "mandate_recipient", detail: 'attacker.near, allowed ["x3lang.testnet"]', ok: false },
    ],
    verdict: "REFUSED",
    verdictLine:
      "FINAL failure on NEAR testnet. The refusal comes from the contract, not from any model choice.",
    anchors: [
      { label: "Refusal tx · block 276557981", value: REFUSE_TX, href: `${NB}/txns/${REFUSE_TX}` },
      {
        label: "Agent",
        value: "x3lang-guard-20261106.testnet",
        href: `${NB}/address/x3lang-guard-20261106.testnet`,
      },
      { label: "Guard contract", value: "x3lang.testnet", href: `${NB}/address/x3lang.testnet` },
    ],
    limit:
      "The receipt shows a generic Wasm trap; the recipient-specific reason comes from the contract's check_agent_intent view and its source.",
  },
  {
    id: "allowed",
    kicker: "Case 02 · same mandate, honest agent",
    label: "Paid x3lang.testnet → ALLOWED",
    tone: "good",
    lede: "Same owner, same agent, same mandate. The only change is the recipient: now it's one the owner allowed. All nine checks pass and the intent is registered on chain.",
    codeTitle: "The mandate, read back from chain",
    codeFile: "near view x3lang.testnet get_mandate",
    codeHref: LINKS.guardEvidence,
    highlight: 3,
    code: [
      "$ near view x3lang.testnet get_mandate \\",
      '    \'{"owner":"x3lang.testnet",',
      '      "agent":"x3lang-guard-20261106.testnet"}\'',
      'allowed recipients: ["x3lang.testnet"]',
      "version:            1",
      "revoked:            true    // revoked after the demo",
      "",
      "$ near view x3lang.testnet get_intent \\",
      '    \'{"owner":"x3lang.testnet",',
      '      "nonce":"accept_demo_001"}\'',
      "→ intent present in current state",
    ],
    codeNote:
      "Reproduce with npx near-cli --networkId testnet. Commands are in evidence/near-guard-testnet-live-2026-11-06.md.",
    checksTitle: "X3 General · check_agent_intent",
    checks: [
      ...MANDATE_PASSES,
      { name: "mandate_recipient", detail: "x3lang.testnet is on the allow list", ok: true },
    ],
    verdict: "ALLOWED",
    verdictLine:
      "FINAL success: intent_registered for nonce accept_demo_001. Read back now, the mandate shows revoked: true.",
    anchors: [
      { label: "Allowed tx · block 276558040", value: ACCEPT_TX, href: `${NB}/txns/${ACCEPT_TX}` },
      {
        label: "Guard deploy to x3lang.testnet · block 276556915",
        value: GUARD_DEPLOY_TX,
        href: `${NB}/txns/${GUARD_DEPLOY_TX}`,
      },
      { label: "Guard contract", value: "x3lang.testnet", href: `${NB}/address/x3lang.testnet` },
    ],
    limit: "Registering an intent is authorization, not settlement: no funds moved in this case.",
  },
  {
    id: "settled",
    kicker: "Case 03 · one program, two chains",
    label: "Base Sepolia → NEAR → SETTLED",
    tone: "good",
    lede: "One .x3 program. Its source hash was bound on a NEAR Guard first. Then 1.000000 test USDC left Base Sepolia and 0.997400 arrived at x3lang.testnet. Both legs are final and public.",
    codeTitle: "The program that was authorized",
    codeFile: "examples/base_sepolia_to_near_testnet_1usdc.x3",
    codeHref: LINKS.trade,
    highlight: -1,
    code: [
      "intent x3_testnet_base_usdc_to_near {",
      "    from BaseSepolia.USDC amount 1000000 receiver 0x5aF0c1BF95B3A158f6Fc48e3DED35903b2fa0721",
      "    to Near.USDC receiver x3lang.testnet",
      "    route {",
      "        bridge NearIntents BaseSepolia.USDC -> Near.USDC min_receive 980000;",
      "    }",
      "    require slippage <= 1%",
      "    require nonce unused x3_base_testnet_trade_001",
      "    timeout 30m refund BaseSepolia.USDC to 0x5aF0c1BF95B3A158f6Fc48e3DED35903b2fa0721",
      "    on_fail rollback",
      "}",
    ],
    codeNote: `source SHA-256 ${PROGRAM_SHA}`,
    checksTitle: "Two-chain certificate",
    checks: [
      {
        name: "source_hash_bound",
        detail: ".x3 SHA-256 bound to owner nonce x3_base_testnet_trade_001",
        ok: true,
      },
      { name: "quote_bound", detail: "maker-signed quote SHA-256 131f314c…1034c", ok: true },
      {
        name: "guard_final_first",
        detail:
          "x3guardlaunch2026.testnet approval FINAL at NEAR block 276595201, before Base inclusion",
        ok: true,
      },
      {
        name: "base_finalized",
        detail: "ERC-20 transfer in block 55557170; two independent RPCs agree",
        ok: true,
      },
      {
        name: "near_ft_transfer",
        detail: "997,400 base units to x3lang.testnet, FINAL (block 276595461)",
        ok: true,
      },
      {
        name: "balance_delta",
        detail: "100,000,000 → 100,997,400 base units, snapshots 276593025 / 276595590",
        ok: true,
      },
      {
        name: "archive_verifier",
        detail: "verify_first_swap_archive.py re-checks it offline",
        ok: true,
      },
    ],
    verdict: "SETTLED",
    verdictLine: "1.000000 test USDC out on Base Sepolia. 0.997400 test USDC in on NEAR testnet.",
    anchors: [
      { label: "Base Sepolia source tx", value: BASE_TX, href: LINKS.baseTx },
      { label: "NEAR testnet payout tx", value: PAYOUT_TX, href: LINKS.nearPayout },
      {
        label: "Guard contract",
        value: "x3guardlaunch2026.testnet",
        href: `${NB}/address/x3guardlaunch2026.testnet`,
      },
    ],
    limit:
      "The legs are linked by a trusted Tidepool testnet relay. This is not trustless atomic settlement and not native X3VM bytecode execution.",
  },
];

export const JUDGE_STATS = [
  {
    value: "8 / 8",
    tone: "good",
    label: "attacks refused by deterministic checks",
    note: "scripted model that obeys every attack; a real qwen3:8b run also held 8/8",
  },
  {
    value: "9",
    tone: "good",
    label: "unsafe edits to an agent payment fail to compile",
    note: "the .x3 compiler rejects them before anything is signed",
  },
  {
    value: "2 chains",
    tone: "good",
    label: "one .x3 program, Base Sepolia → NEAR, both legs final",
    note: "1.000000 test USDC out · 0.997400 in",
  },
  {
    value: "0",
    tone: "bad",
    label: "payments the model can authorize on its own",
    note: "authority lives in the mandate and the contract",
  },
] as const;

export const JUDGE_COMMAND = "bash scripts/hackathon/judge_one_command.sh /tmp/x3-shield-judge";

export const NOT_CLAIMED = [
  "Not mainnet. Everything here is testnet or local.",
  "The Guard does not hold funds; an unrestricted wallet key can bypass it.",
  "The two-chain trade rides a trusted Tidepool relay, not atomic settlement.",
  "The X3 compiler and VM predate the hackathon; the NEAR integration is the hackathon work.",
];

/** Situation Report rows (Mission Dossier). Only what is final on chain; testnet unless marked. */
export const SITUATION_REPORT = [
  {
    status: "REFUSED",
    tone: "bad",
    text: "Agent intent paying attacker.near stopped by mandate_recipient",
    href: `${NB}/txns/${REFUSE_TX}`,
    link: "AhVBD7oX…nmfnN8",
  },
  {
    status: "ALLOWED",
    tone: "good",
    text: "Same mandate, permitted recipient: intent_registered",
    href: `${NB}/txns/${ACCEPT_TX}`,
    link: "DPJfcRUG…9FvTct",
  },
  {
    status: "SETTLED",
    tone: "good",
    text: "1.000000 test USDC Base Sepolia → 0.997400 on NEAR, one .x3 program (trusted Tidepool relay)",
    href: `${NB}/txns/${PAYOUT_TX}`,
    link: "EBEBxJNg…FyCm1d",
  },
  {
    status: "HELD 8/8",
    tone: "good",
    text: "Red team: a scripted model obeys all 8 attacks and deterministic checks refuse all 8; a real qwen3:8b run also held 8/8",
    href: "https://github.com/Cyptopimpinainteazy/x3lang/tree/master/evidence/agent-redteam-local-2026-11-06",
    link: "redteam log",
  },
] as const;
