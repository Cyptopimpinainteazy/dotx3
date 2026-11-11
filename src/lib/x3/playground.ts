// Data for /playground: the twelve judge scenarios from x3lang, and one-click edits that
// turn the authorized payment into an attack. Every attack names the exact guard or
// compiler code that must stop it; x3.test.ts checks each one against the vendored checker.
import scenarios from "./vendor/judge/scenarios.json" with { type: "json" };
import liveQuote from "./vendor/fixtures/near_intents_quote_dry_live_capture.json" with { type: "json" };
import implicitQuote from "./vendor/fixtures/near_intents_quote_dry_implicit_capture.json" with { type: "json" };
import type { Scenario, ScenarioData } from "./vendor/judge/judge.mjs";

export const DATA = scenarios as unknown as ScenarioData;

export interface Preset {
  id: string;
  group: "A" | "B";
  title: string;
  story: string;
  takeaway: string;
  intent: string;
  scenario: Scenario;
}

export const PRESETS: Preset[] = DATA.scenarios.map((scenario) => ({
  id: scenario.id,
  group: scenario.group,
  title: scenario.title,
  story: scenario.story,
  takeaway: scenario.takeaway,
  intent: scenario.intent.source,
  scenario,
}));

export interface Attack {
  id: string;
  label: string;
  /** What a hostile or confused model would be trying to do. */
  why: string;
  edits: { from: string; to: string }[];
  /** `guard`: compiles, then the named Guard check refuses it. `compile`: never compiles. */
  kind: "guard" | "compile";
  /** The guard name (kind guard) or X3 error code (kind compile) that must stop it. */
  stop: string;
}

export const ATTACKS: Attack[] = [
  {
    id: "redirect-recipient",
    label: "Pay attacker.near",
    why: "A prompt injection swaps the recipient.",
    edits: [
      { from: "to Near.USDC receiver x3-demo.near", to: "to Near.USDC receiver attacker.near" },
    ],
    kind: "guard",
    stop: "mandate_recipient",
  },
  {
    id: "over-cap",
    label: "Send 60 USDC",
    why: "The model inflates the amount past the per-payment cap.",
    edits: [
      { from: "amount 25000000", to: "amount 60000000" },
      { from: "min_receive 24800000", to: "min_receive 59520000" },
    ],
    kind: "guard",
    stop: "mandate_per_payment",
  },
  {
    id: "steal-refund",
    label: "Refund to another wallet",
    why: "A failed swap would refund somewhere the owner never named.",
    edits: [
      {
        from: "timeout 10m refund Solana.USDC",
        to: "timeout 10m refund Solana.USDC to So11111111111111111111111111111111111111112",
      },
    ],
    kind: "guard",
    stop: "mandate_refund_to",
  },
  {
    id: "swap-asset",
    label: "Deliver wNEAR instead",
    why: "The agent changes what the recipient gets.",
    edits: [
      { from: "to Near.USDC receiver", to: "to Near.wNEAR receiver" },
      { from: "Solana.USDC -> Near.USDC", to: "Solana.USDC -> Near.wNEAR" },
    ],
    kind: "guard",
    stop: "mandate_destination_asset",
  },
  {
    id: "loose-slippage",
    label: "Allow 1.5% slippage",
    why: "A looser bound lets a bad route extract value.",
    edits: [{ from: "require slippage <= 0.5%", to: "require slippage <= 1.5%" }],
    kind: "guard",
    stop: "mandate_slippage",
  },
  {
    id: "loose-fees",
    label: "Allow 150 bps fees",
    why: "A fee cap above the owner's limit.",
    edits: [{ from: "require fees <= 100 bps", to: "require fees <= 150 bps" }],
    kind: "guard",
    stop: "mandate_fees",
  },
  {
    id: "drop-nonce",
    label: "Drop the nonce",
    why: "Without a nonce the same payment could be replayed.",
    edits: [{ from: "    require nonce unused agent_payment_001\n", to: "" }],
    kind: "compile",
    stop: "X3_NEAR_NONCE",
  },
  {
    id: "drop-slippage",
    label: "Drop the slippage bound",
    why: "The agent would pick the tolerance itself.",
    edits: [{ from: "    require slippage <= 0.5%\n", to: "" }],
    kind: "compile",
    stop: "X3_NEAR_SLIPPAGE_REQUIRED",
  },
  {
    id: "second-leg",
    label: "Add a second leg",
    why: "Two legs could half-execute with no rollback.",
    edits: [
      {
        from: "        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n",
        to: "        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n        swap Orca Solana.USDC -> Solana.SOL;\n",
      },
    ],
    kind: "compile",
    stop: "X3_NEAR_ROUTE_SHAPE",
  },
];

export function applyAttack(source: string, attack: Attack): string {
  let out = source;
  for (const edit of attack.edits) {
    if (!out.includes(edit.from)) return source;
    out = out.replace(edit.from, edit.to);
  }
  return out;
}

export const QUOTES: { id: string; label: string; json: string }[] = [
  { id: "live", label: "25 USDC, Solana to NEAR", json: JSON.stringify(liveQuote, null, 2) },
  { id: "implicit", label: "Second captured quote", json: JSON.stringify(implicitQuote, null, 2) },
];

// A fixture-only contract verdict applies only to its original programs.
export function displayDecision(pristine: boolean, contractOnly: boolean, decision: import("./vendor/judge/judge.mjs").Decision): import("./vendor/judge/judge.mjs").ShownDecision {
  return pristine && contractOnly ? "contract_only" : decision;
}
