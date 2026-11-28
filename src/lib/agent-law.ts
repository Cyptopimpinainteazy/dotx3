export const AGENT_LAW_SOURCE = "98d23cf499d3f17c2a9f29f62bfddaeb1c0ada59";
export const AGENT_LAW_REPO = "https://github.com/Cyptopimpinainteazy/x3lang";
export const AGENT_LAW_BLOB = AGENT_LAW_REPO + "/blob/" + AGENT_LAW_SOURCE;
export const AGENT_LAW_STAGES = [
  { step: "01", title: "Birth", state: "Implemented locally", detail: "An operator signs the root identity. Child birth binds its key, parent grant, capabilities, expiry and reserved budget in a SQLite transaction." },
  { step: "02", title: "Compile", state: "Implemented locally", detail: "The existing .x3 parser, type checker and lowerer produce a local payment plan. A host-owned envelope checks recipient, chains, asset, amount, fees, slippage and refund terms." },
  { step: "03", title: "Authorize & enforce", state: "Implemented locally", detail: "A signed action binds the exact source hash, registry, adapter policy, nonce and expiry. Major actions need a majority of eligible signing identities. The demonstrated adapter only compiles plans." },
  { step: "04", title: "Retire & revoke", state: "Implemented locally", detail: "A deterministic policy violation retires the identity. Revoked agents and descendants cannot reserve later actions. Retirement and consumed nonces survive restart." },
  { step: "05", title: "Preserve & review", state: "Local protocol; scripted demo jurors", detail: "The runtime preserves source and outcome evidence. Signed findings can produce a regression proposal. Subjects, ancestors, descendants, aliases and revoked registered jurors are excluded." },
  { step: "06", title: "Evolve", state: "Proposal export only", detail: "The court exports rejected source as a regression candidate. It cannot restore an agent, rewrite commandments, train a model or activate a policy. Promotion still requires owner review and passing tests." },
] as const;
