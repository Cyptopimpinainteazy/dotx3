import { LINKS } from "./front-door";

export const nearTracks = [
  {
    slug: "security",
    title: "AI Security & Defense",
    question: "Who stops an injected agent from paying an attacker?",
    detail:
      "The owner writes the spending mandate. The compiler rejects unsupported requests; the NEAR Guard checks signed quote terms against the stored rules.",
    evidence:
      "NEAR testnet records show a wrong-recipient refusal and an allowed intent. On mainnet, invoice_06 passed all 21 mandate and signed-quote checks before the Solana deposit.",
    limit:
      "Guard authorizes a deposit address; it does not custody the USDC. An unrestricted funding-wallet key can bypass it. A hostile-model refusal on mainnet and an independent security review remain pending.",
    evidenceHref: LINKS.mainnetEvidence,
    next:
      "Publish the scoped-vault allowed payment and refusal evidence, then demonstrate a hostile model using the same restricted execution path.",
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
      "x3-agent.x3lang.near accepted invoice_06 with a FunctionCall key restricted to three Guard methods. Owner approval preceded that call; a separate Solana wallet funded 25 USDC and 24.9952 USDC arrived on NEAR.",
    limit:
      "The agent authorized the payment; it did not pay. The owner signed the Solana deposit, the agent account still holds a FullAccess recovery key, and the Settled outcome the agent recorded is not authenticated by Guard.",
    evidenceHref: LINKS.mainnetEvidence,
    next:
      "Give the agent a contract-held budget it can actually spend, so the same mandate limits a payment the agent sends, and remove the recovery key from the agent account.",
    source: "MAINNET_AGENT_PREFLIGHT.md",
    demo: "/demo",
  },
  {
    slug: "business",
    title: "Autonomous Business",
    question: "How does a business let an AI agent spend without handing it the treasury?",
    detail:
      "The owner sets the constraints once in a .x3 mandate: per-payment and 24-hour caps, an approval threshold, recipient and asset allowlists, a refund address and an expiry. The agent can only propose payments; Guard enforces the mandate on NEAR mainnet before any cross-chain payment through NEAR Intents.",
    evidence:
      "Mainnet invoice_06: a 25 USDC per-payment and daily cap, one allowed recipient, a pinned refund wallet and owner approval above 24.999999 USDC, all enforced by Guard before the Solana deposit; 24.9952 USDC was delivered on NEAR.",
    limit:
      "invoice_06 was owner-funded and paid to the owner's own account: x3lang.near is both the mandate owner and its only allowed recipient, and \"invoice\" is a nonce label. There are no treasury, sales, procurement, revenue-sharing or recurring-payment features; business uses are intended, not adopted.",
    evidenceHref: LINKS.mainnetEvidence,
    next:
      "Run the same mandate for a real counterparty: a vendor invoice paid from a contract-held budget, with recurring payments and a revenue split under owner-set caps.",
    source: "mandate.rs",
    demo: "/playground",
  },
  {
    slug: "defi",
    title: "Unstoppable DeFi",
    question: "What cross-chain transfer can a judge verify?",
    detail:
      "Guard checked an official signed 1Click quote on NEAR mainnet before a Solana USDC deposit. A separate historical Base Sepolia transfer demonstrates a committed .x3 source hash bound before funding.",
    evidence:
      "Mainnet invoice_06: 25.000000 USDC deposited on Solana and 24.995200 USDC delivered to x3lang.near. The public observer reports 18 passed checks, zero failures and one fact unreadable on chain. Historical testnet: 1.000000 test USDC to 0.997400 through Tidepool.",
    limit:
      "1Click status associates the mainnet deposit and payout; it is not cryptographic cross-chain causality. Guard did not custody funds. The historical Tidepool trade remains a separate trusted-relay testnet demonstration.",
    evidenceHref: LINKS.mainnetEvidence,
    next:
      "Publish custody evidence for a deposit Guard controls, and an independently verified link between the two settlement legs.",
    source: "FIRST_FINALIZED_SWAP_EVIDENCE.md",
    demo: "/proof",
  },
] as const;
