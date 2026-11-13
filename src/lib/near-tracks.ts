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
      "The restricted NEAR call is verified. Control of the Solana funding wallet is unconfirmed, the two stored .x3 hashes have no matching committed source files, and Guard has no recorded settlement outcome for this intent.",
    evidenceHref: LINKS.mainnetEvidence,
    next:
      "Match the original mandate and payment files to their stored hashes, establish funding-wallet control, and record the verified outcome through the authorized Guard workflow.",
    source: "MAINNET_AGENT_PREFLIGHT.md",
    demo: "/demo",
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
      "Complete source-hash linkage and publish the remaining custody evidence. Confirm the owner-approved submission record before describing DeFi as a submitted track.",
    source: "FIRST_FINALIZED_SWAP_EVIDENCE.md",
    demo: "/proof",
  },
] as const;
