import { VAULT_PILOT_LINKS } from "./vault-pilot";
import { LINKS } from "./front-door";

export const nearTracks = [
  {
    slug: "security",
    title: "AI Security & Defense",
    question: "Who stops an injected agent from paying an attacker?",
    detail:
      "The owner writes the spending mandate. The compiler rejects unsupported requests; the NEAR Guard checks signed quote terms against the stored rules.",
    evidence:
      "The November 14 Solana vault pilot enforced an owner-approved 5-USDC agent payment with per-payment/day caps and a one-use nonce; 4.999746 USDC reached NEAR. Separately, invoice_06 passed 21 NEAR Guard checks. Wrong-agent/digest/replay refusals for the vault are unsigned mainnet simulations.",
    limit:
      "Guard authorizes a deposit address; it does not custody the USDC. An unrestricted funding-wallet key can bypass it. A hostile-model refusal on mainnet and an independent security review remain pending.",
    evidenceHref: VAULT_PILOT_LINKS.proof,
    next:
      "The bounded source-vault proof is published. A live hostile-model mainnet refusal and independent external audit remain open.",
    source: "GUARD_TESTNET_EVIDENCE.md",
    demo: "/playground",
  },
  {
    slug: "agents",
    title: "Agent Economy",
    question: "How can an agent request a payment within its owner's budget?",
    detail:
      "A payment program references an owner mandate with recipient and asset allowlists, per-payment and daily caps, approval thresholds, fees, slippage and expiry.",
    evidence:
      "A dedicated Solana agent signed execution from a policy-PDA-owned vault: 5 USDC deposited, 4.999746 USDC delivered to x3lang.near. The owner first approved the exact quote. The earlier NEAR FunctionCall-key quote acceptance is separate evidence.",
    limit:
      "The new agent executed one exact owner-approved quote. Owner upgrade/recovery authority remains trusted. This is not unrestricted autonomous spending, and no additional NEAR Guard call is claimed for this pilot.",
    evidenceHref: VAULT_PILOT_LINKS.proof,
    next:
      "Keep the reviewed recovery authority and verify broader agent workflows in a zero-value environment before extending the bounded pilot.",
    source: "MAINNET_AGENT_PREFLIGHT.md",
    demo: "/demo",
  },
  {
    slug: "business",
    title: "Autonomous Business",
    question: "How does a business let an AI agent spend without handing it the treasury?",
    detail:
      "For invoice_06, the owner set a .x3 mandate with spending limits, recipient, refund and approval rules, and NEAR Guard checked the signed 1Click quote before that owner-funded deposit. The later 5-USDC Solana vault pilot used a separate source-vault authorization path and did not call NEAR Guard.",
    evidence:
      "Mainnet invoice_06: a 25 USDC per-payment and daily cap, one allowed recipient, a pinned refund wallet and owner approval above 24.999999 USDC, all enforced by Guard before the Solana deposit; 24.9952 USDC was delivered on NEAR.",
    limit:
      "invoice_06 was owner-funded and paid to the owner's own account: x3lang.near is both the mandate owner and its only allowed recipient, and \"invoice\" is a nonce label. There are no treasury, sales, procurement, revenue-sharing or recurring-payment features; business uses are intended, not adopted.",
    evidenceHref: LINKS.mainnetEvidence,
    next:
      "Run the same mandate for a real counterparty: a vendor invoice paid from a contract-held budget, with recurring payments and a revenue split under owner-set caps.",
    source: "X3LANG_THREE_TRACK_CONTROL.md",
    demo: "/playground",
  },
  {
    slug: "defi",
    title: "Unstoppable DeFi",
    question: "What cross-chain transfer can a judge verify?",
    detail:
      "Guard checked an official signed 1Click quote on NEAR mainnet before a Solana USDC deposit. A separate historical Base Sepolia transfer demonstrates a committed .x3 source hash bound before funding.",
    evidence:
      "November 14 source-vault pilot: the agent deposited 5 USDC and 4.999746 USDC reached x3lang.near. Finalized source event/SPL CPI, NEAR token event and provider SUCCESS are archived. Earlier owner-funded invoice_06 and historical Tidepool testnet delivery remain separate.",
    limit:
      "1Click status associates the mainnet deposit and payout; it is not cryptographic cross-chain causality. Guard did not custody funds. The historical Tidepool trade remains a separate trusted-relay testnet demonstration.",
    evidenceHref: VAULT_PILOT_LINKS.proof,
    next:
      "The Solana vault custody proof is published; source-RPC quorum, cryptographic solver causality and broader production validation remain open.",
    source: "FIRST_FINALIZED_SWAP_EVIDENCE.md",
    demo: "/proof",
  },
] as const;
