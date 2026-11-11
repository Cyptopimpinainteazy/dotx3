export const nearTracks = [
  {
    slug: "security",
    title: "AI Security & Defense",
    question: "Who stops an injected agent from paying an attacker?",
    detail:
      "The owner writes the spending mandate. The compiler rejects unsupported requests; the NEAR Guard checks signed quote terms against the stored rules.",
    evidence:
      "Historical NEAR testnet refusals, quote checks, mandate registration and revocation.",
    limit:
      "Guard does not custody assets. A holder of an unrestricted origin-wallet key can bypass it.",
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
      "Local approved and denied policy cases plus historical Guard-mediated testnet agent calls.",
    limit:
      "Local approval is a preview. Quote acceptance authorizes a deposit address; it does not prove a funded payment or constrain unrelated wallet transfers.",
    source: "MAINNET_AGENT_PREFLIGHT.md",
    demo: "/demo",
  },
  {
    slug: "defi",
    title: "Unstoppable DeFi",
    question: "What cross-chain transfer can a judge verify?",
    detail:
      "An .x3 program specified a Base Sepolia to NEAR testnet transfer. Its source hash was registered on Guard before the source transfer.",
    evidence:
      "1.000000 test USDC sent from Base Sepolia; 0.997400 test USDC received on NEAR testnet through the trusted Tidepool relay.",
    limit:
      "This is historical trusted-relay testnet delivery. Official funded 1Click mainnet settlement and cryptographic cross-chain atomicity are not established.",
    source: "FIRST_FINALIZED_SWAP_EVIDENCE.md",
    demo: "/proof",
  },
] as const;
