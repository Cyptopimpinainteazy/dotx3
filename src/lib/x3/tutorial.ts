// Data and checks for /learn, the interactive .x3 tutorial.
//
// The tutorial never re-implements a rule. Lessons that "run" something call the vendored
// x3guard.mjs (see vendor/PROVENANCE.md): the browser port of x3lang's near_intents.py and of
// x3-guard's check_mandate, kept identical to Python by x3lang's test_demo_parity.py.
// The one place it shows recorded results instead is "Try to break it": those codes are the
// output of x3lang's scripts/hackathon/x3_wont_compile.py, and tutorial.test.ts checks that
// the vendored checker refuses each edit too.
import * as x3 from "./vendor/x3guard.mjs";
import scenarios from "./vendor/judge/scenarios.json" with { type: "json" };

interface ScenarioFile {
  evaluated_at: string;
  mandate: { source: string };
  tokens: { records: unknown[] };
}
const DATA = scenarios as unknown as ScenarioFile;

/** The token list and clock the judge scenarios use, so results match x3lang's. */
export const TOKENS = DATA.tokens.records;
export const MANDATE_CREATED_MS = Date.parse(DATA.evaluated_at);
const DAY_MS = 86_400_000;

export const REFUND = "4Nd1mzi8Y1QYxJt9wZWBYZpG7S4pYkZs6YzD3Vt9aBcD";

/** x3-lang/examples/near_intents_agent_payment.x3, without its header comment. */
export const INTENT_LINES = [
  "intent near_intents_agent_payment {",
  `    from Solana.USDC amount 25000000 receiver ${REFUND}`,
  "    to Near.USDC receiver x3-demo.near",
  "    route {",
  "        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;",
  "    }",
  "    under mandate x3-owner.near",
  "    require slippage <= 0.5%",
  "    require fees <= 100 bps",
  "    require nonce unused agent_payment_001",
  "    timeout 10m refund Solana.USDC",
  "    on_fail rollback",
  "}",
];
export const INTENT_SOURCE = INTENT_LINES.join("\n") + "\n";

/** The mandate the judge scenarios use (x3-lang/examples/near_mandate_agent.x3). */
export const MANDATE_SOURCE = DATA.mandate.source;
export const MANDATE_LINES = MANDATE_SOURCE.split("\n").filter((l) => l.trim() !== "" && !l.trim().startsWith("//"));

/** `line` is the start of the source line the note explains; tutorial.test.ts pins each pair. */
export interface LineNote { line: string; what: string; becomes: string; rule: string }

export const INTENT_NOTES: LineNote[] = [
  { line: "intent ", what: "Names the program. One intent per payment; receipts and logs refer to it by this name.", becomes: "The intent's identity in the compiled plan.", rule: "The NEAR adapter accepts one intent shape. Anything it cannot honour exactly is refused, never approximated." },
  { line: "from ", what: "Where the money starts: a chain.ASSET, an amount in integer base units, and the source account. That account is also where a refund goes unless the timeout names another.", becomes: "1Click originAsset (resolved from the token list), amount = 25000000 base units, swapType EXACT_INPUT.", rule: "amount 0 is refused. A receiver that is not an address on the from chain is refused (X3_INVALID_RECEIVER)." },
  { line: "to ", what: "Where the money must arrive and who receives it.", becomes: "1Click destinationAsset and recipient, recipientType DESTINATION_CHAIN.", rule: "A look-alike such as x3-demo.neаr, with a Cyrillic а, is refused by the type checker (X3_INVALID_RECEIVER)." },
  { line: "route {", what: "Opens the route block: how the value travels.", becomes: "The plan's legs.", rule: "On the NEAR path the block holds exactly one leg." },
  { line: "bridge NearIntents", what: "The single leg: settle through NEAR Intents from Solana USDC to NEAR USDC, and never accept less than 24.8 USDC out.", becomes: "The 1Click quote request; the quote's minAmountOut must clear min_receive.", rule: "A second leg is refused (X3_NEAR_ROUTE_SHAPE): 1Click settles one swap, and composing legs could leave a partial execution with no rollback." },
  { line: "}", what: "Closes the route block.", becomes: "—", rule: "—" },
  { line: "under mandate", what: "An agent makes this payment for x3-owner.near, so it is checked against that owner's mandate.", becomes: "The owner carried into the plan. x3-guard's agent methods check the mandate terms on chain before the intent is registered.", rule: "The clause alone enforces nothing in a generic VM build; the mandate check and the Guard do." },
  { line: "require slippage", what: "The loosest price movement this payment accepts: 0.5%, which is 50 basis points. Write it 0.5%, 50 bps or 50bps; a bare number is refused.", becomes: "1Click slippageTolerance in basis points, rounded down so it is never looser than written.", rule: "Leave it out: X3_NEAR_SLIPPAGE_REQUIRED. A bare 50, or 50 bps with a space, is refused (X3_NEAR_BOUND_UNIT). A bare number below 1 is a fraction: 0.5 means 50%." },
  { line: "require fees", what: "The most the route may cost, as a share of the amount.", becomes: "Checked on every path of the quote: its effective cost and, separately, the refund fee a failed swap would be charged.", rule: "The mandate also caps fees. An intent looser than the mandate fails mandate_fees." },
  { line: "require nonce unused", what: "A one-use identifier. Replaying the same payment is refused.", becomes: "The key x3-guard records the intent under.", rule: "Exactly one is required. Drop it and the compile fails: X3_NEAR_NONCE." },
  { line: "timeout ", what: "If the swap has not completed in 10 minutes, refund in Solana USDC, the asset that was deposited.", becomes: "1Click deadline = now + 10m, refundTo = the from receiver (no `to` given), refundType ORIGIN_CHAIN.", rule: "Drop it: X3_NEAR_TIMEOUT_REQUIRED. Refund in another asset, such as Near.USDC: X3_NEAR_REFUND_ASSET." },
  { line: "on_fail", what: "If the swap fails, roll back: the deposit is refunded to refundTo.", becomes: "1Click refunds a failed swap to refundTo.", rule: "on_fail halt or quarantine is refused on this path; 1Click cannot express them." },
  { line: "}", what: "Closes the intent.", becomes: "—", rule: "—" },
];

export const MANDATE_NOTES: LineNote[] = [
  { line: "mandate ", what: "Names the rulebook. The first line must be exactly `mandate <name> {`, and any line the parser does not recognise is refused.", becomes: "The compiled terms carry program_sha256, this file's own SHA-256, so the on-chain rules name the source they came from.", rule: "owner, agent, spend, per_payment, per_24h, allow recipients, allow assets, refund_to and expires are all required (X3_MANDATE_PARSE)." },
  { line: "owner ", what: "The account that signs create_mandate, and can revoke the mandate at any time.", becomes: "The owner of the mandate record in x3-guard.", rule: "Must be a valid NEAR account (X3_MANDATE_ACCOUNT)." },
  { line: "agent ", what: "The AI agent's account: the only one allowed to register payments under this mandate.", becomes: "The agent key of the mandate record.", rule: "Must be a different account from the owner (X3_MANDATE_ACCOUNT)." },
  { line: "spend ", what: "The one asset the agent may spend.", becomes: "terms.asset, checked by mandate_asset.", rule: "A chain.asset reference on a chain NEAR Intents supports (X3_MANDATE_ASSET)." },
  { line: "per_payment ", what: "The most any single payment may move: 50 USDC, in base units.", becomes: "terms.per_payment_cap, checked by mandate_per_payment.", rule: "Must not exceed per_24h (X3_MANDATE_LIMIT)." },
  { line: "per_24h ", what: "The most the agent may move in any rolling 24 hours: 200 USDC.", becomes: "terms.daily_cap, checked by mandate_daily, with a limit of 64 payments per window.", rule: "A u128 base-unit amount (X3_MANDATE_LIMIT)." },
  { line: "allow recipients", what: "Who may be paid. Comma-separated.", becomes: "terms.recipients, checked by mandate_recipient.", rule: "1 to 16 distinct addresses, each valid on a destination chain (X3_MANDATE_LIST, X3_MANDATE_RECIPIENT)." },
  { line: "allow assets", what: "What the money may arrive as.", becomes: "terms.destination_assets, checked by mandate_destination_asset.", rule: "1 to 16 distinct assets from the token list (X3_MANDATE_LIST)." },
  { line: "refund_to ", what: "Where a failed payment refunds. The agent cannot point refunds at itself.", becomes: "terms.refund_to, checked by mandate_refund_to.", rule: "An address on the spend chain, and never the word sender (X3_MANDATE_REFUND_TO)." },
  { line: "require slippage", what: "The loosest slippage any agent intent may declare: 1%, or 100bps.", becomes: "terms.max_slippage_bps = 100, checked by mandate_slippage.", rule: "Required, or the agent would choose it (X3_MANDATE_BOUND). At most 10000 bps. Write 1% or 100bps: a bare 100, or 100 bps with a space, is refused (X3_NEAR_BOUND_UNIT)." },
  { line: "require fees", what: "The loosest fee ceiling any agent intent may declare.", becomes: "terms.max_fee_bps = 100, checked by mandate_fees.", rule: "Required for the same reason (X3_MANDATE_BOUND)." },
  { line: "approve above", what: "A payment over 30 USDC waits until 1 of the listed approvers signs off.", becomes: "terms.approval_above, approvers and approval_threshold.", rule: "Must be below per_payment; 1 to 8 distinct approvers; the agent can never approve its own payments; n is 1 to the number of approvers (X3_MANDATE_APPROVAL)." },
  { line: "expires ", what: "The mandate ends 30 days after it is compiled.", becomes: "terms.expires_at_ms, checked by mandate_active and mandate_deadline.", rule: "A positive <n>ms|s|m|h|d duration (X3_MANDATE_EXPIRES). Days are allowed here, unlike a swap timeout." },
  { line: "}", what: "Closes the mandate. Nothing may follow it.", becomes: "—", rule: "—" },
];

export interface BreakEdit { id: string; label: string; tried: string; old: string; next: string; code: string; why: string }

/** The nine edits of x3lang's scripts/hackathon/x3_wont_compile.py, with the codes it records. */
export const EDITS: BreakEdit[] = [
  { id: "no_slippage_bound", label: "Drop slippage", tried: "drop `require slippage`", old: "    require slippage <= 0.5%\n", next: "", code: "X3_NEAR_SLIPPAGE_REQUIRED", why: "Without a slippage bound the solver network would decide how much price movement to accept. The compiler refuses to leave that open." },
  { id: "no_timeout", label: "Drop timeout", tried: "drop the timeout and refund", old: "    timeout 10m refund Solana.USDC\n", next: "", code: "X3_NEAR_TIMEOUT_REQUIRED", why: "No deadline and no refund path means a stuck deposit has nowhere to go." },
  { id: "no_nonce", label: "Drop nonce", tried: "drop the one-use nonce", old: "    require nonce unused agent_payment_001\n", next: "", code: "X3_NEAR_NONCE", why: "Without a nonce the same payment could be replayed. Exactly one is required." },
  { id: "second_leg", label: "Add a 2nd leg", tried: "add a second swap leg", old: "        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n", next: "        bridge NearIntents Solana.USDC -> Near.USDC min_receive 24800000;\n        bridge NearIntents Near.USDC -> Near.wNEAR;\n", code: "X3_NEAR_ROUTE_SHAPE", why: "1Click settles one swap. Composing it with another leg could leave a partial execution with no rollback." },
  { id: "unenforceable_guard", label: "Unenforceable guard", tried: "add a finality guard 1Click can't enforce", old: "    require nonce unused agent_payment_001\n", next: "    require nonce unused agent_payment_001\n    require finality Solana >= 32\n", code: "X3_NEAR_GUARD_UNENFORCEABLE", why: "A guard nothing on this path can check would be a false promise, so the adapter refuses it instead of ignoring it." },
  { id: "refund_other_asset", label: "Refund other asset", tried: "refund in a different asset", old: "timeout 10m refund Solana.USDC", next: "timeout 10m refund Near.USDC", code: "X3_NEAR_REFUND_ASSET", why: "A refund must be in the asset that was deposited." },
  { id: "lookalike_recipient", label: "Look-alike recipient", tried: "pay a Cyrillic look-alike of x3-demo.near", old: "receiver x3-demo.near", next: "receiver x3-demo.neаr", code: "X3_NEAR_TYPECHECK (X3_INVALID_RECEIVER)", why: "The а in neаr is Cyrillic U+0430. It looks right to a person and is not a valid NEAR account to the type checker." },
  { id: "wrong_chain_address", label: "Wrong-chain address", tried: "send from Ethereum with a Solana address", old: "from Solana.USDC", next: "from Ethereum.USDC", code: "X3_NEAR_TYPECHECK (X3_INVALID_RECEIVER)", why: "The from receiver is a Solana address, which is not an address on Ethereum." },
  { id: "zero_amount", label: "Amount 0", tried: "pay an amount of 0", old: "amount 25000000", next: "amount 0", code: "X3_NEAR_TYPECHECK (X3_INVALID_AMOUNT)", why: "A zero-value payment is refused before anything else sees it." },
];

export function applyEdit(edit: BreakEdit): string {
  return INTENT_SOURCE.replace(edit.old, edit.next);
}

export interface DiffLine { kind: "same" | "del" | "add"; text: string }

/** One contiguous change: common prefix, removed lines, added lines, common suffix. */
export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.replace(/\n$/, "").split("\n");
  const b = after.replace(/\n$/, "").split("\n");
  let p = 0;
  while (p < a.length && p < b.length && a[p] === b[p]) p++;
  let s = 0;
  while (s < a.length - p && s < b.length - p && a[a.length - 1 - s] === b[b.length - 1 - s]) s++;
  return [
    ...a.slice(0, p).map((text) => ({ kind: "same" as const, text })),
    ...a.slice(p, a.length - s).map((text) => ({ kind: "del" as const, text })),
    ...b.slice(p, b.length - s).map((text) => ({ kind: "add" as const, text })),
    ...a.slice(a.length - s).map((text) => ({ kind: "same" as const, text })),
  ];
}

export type BaseUnits = { ok: true; digits: string; value: bigint } | { ok: false; error: string };

/** A human amount in base units, without floating point. Refuses anything below one unit. */
export function toBaseUnits(input: string, decimals: number): BaseUnits {
  const s = input.trim().replace(/_/g, "");
  if (!/^\d+(\.\d+)?$/.test(s)) return { ok: false, error: "Not a number." };
  const [whole, frac = ""] = s.split(".");
  if (frac.length > decimals) {
    return { ok: false, error: `Smaller than one base unit: ${frac.length} decimal places, but this token has ${decimals}.` };
  }
  const digits = (whole + frac.padEnd(decimals, "0")).replace(/^0+(?=\d)/, "");
  return { ok: true, digits, value: BigInt(digits) };
}

export type Compiled<T> = { ok: true; value: T } | { ok: false; code: string; message: string; line: number | null };

function failure(e: unknown): { ok: false; code: string; message: string; line: number | null } {
  if (e && typeof e === "object" && "code" in e) {
    const err = e as { code: string; message: string; line?: number | null };
    return { ok: false, code: err.code, message: err.message, line: err.line ?? null };
  }
  return { ok: false, code: "ERROR", message: e instanceof Error ? e.message : String(e), line: null };
}

type LoweredMandate = ReturnType<typeof x3.lowerMandate>;

/** Compile mandate source with the real parser and lowering, as `near_intents.py mandate args` does. */
/** `sourceSha256` becomes terms.program_sha256; pass the real hash (x3.sha256Hex) when it is shown. */
export function compileMandate(source: string, sourceSha256 = "", nowMs = MANDATE_CREATED_MS): Compiled<LoweredMandate> {
  try {
    return { ok: true, value: x3.lowerMandate(x3.parseMandate(source), TOKENS, nowMs, sourceSha256) };
  } catch (e) {
    return failure(e);
  }
}

export const sha256Hex = (text: string): Promise<string> => x3.sha256Hex(text);

export interface IntentFields {
  recipient: string;
  amount: string;
  spend: string;
  arrive: string;
  slippage: string;
  fees: string;
  refundTo: string;
  timeoutMinutes: string;
}

export const INTENT_DEFAULTS: IntentFields = {
  recipient: "x3-demo.near",
  amount: "25",
  spend: "Solana.USDC",
  arrive: "Near.USDC",
  slippage: "0.5%",
  fees: "100",
  refundTo: "",
  timeoutMinutes: "10",
};

/** The agent's intent for the given fields, in the shape of near_intents_agent_payment.x3. */
export function intentSource(f: IntentFields): string {
  const amount = toBaseUnits(f.amount, 6);
  const base = amount.ok ? amount.value : null;
  // The example accepts 99.2% of what it sends (24.8 of 25 USDC); keep that ratio.
  const minReceive = base === null ? "0" : ((base * 992n) / 1000n).toString();
  const refund = f.refundTo.trim() ? ` to ${f.refundTo.trim()}` : "";
  return [
    "intent agent_payment {",
    `    from ${f.spend.trim()} amount ${amount.ok ? amount.digits : f.amount.trim()} receiver ${REFUND}`,
    `    to ${f.arrive.trim()} receiver ${f.recipient.trim()}`,
    "    route {",
    `        bridge NearIntents ${f.spend.trim()} -> ${f.arrive.trim()} min_receive ${minReceive};`,
    "    }",
    "    under mandate x3-owner.near",
    `    require slippage <= ${f.slippage.trim()}`,
    `    require fees <= ${f.fees.trim()} bps`,
    "    require nonce unused agent_payment_001",
    `    timeout ${f.timeoutMinutes.trim()}m refund ${f.spend.trim()}${refund}`,
    "    on_fail rollback",
    "}",
    "",
  ].join("\n");
}

export interface GuardState {
  revoked: boolean;
  /** Days since the mandate was compiled. It expires at 30. */
  days: number;
  spentToday: bigint;
  paymentsToday: number;
}

export type Verdict =
  | { stage: "compile"; code: string; message: string; line: number | null }
  | { stage: "mandate"; decision: "allowed" | "approval_required" | "denied"; checks: x3.MandateCheck[]; approvals: number };

/**
 * The judge pipeline (vendor/judge/judge.mjs `evaluate`): parse, type-check and lower the
 * intent, build its dry quote request, then run x3-guard's check_mandate against the example
 * mandate with the given on-chain state.
 */
export function checkIntent(source: string, state: GuardState): Verdict {
  const nowMs = MANDATE_CREATED_MS + Math.round(state.days * DAY_MS);
  const mandate = compileMandate(MANDATE_SOURCE);
  if (!mandate.ok) return { stage: "compile", code: mandate.code, message: mandate.message, line: mandate.line };
  let leg: x3.Leg;
  let request: Record<string, unknown>;
  try {
    const intent = x3.parse(source);
    const errors = x3.typecheck(intent);
    if (errors.length) return { stage: "compile", code: `X3_NEAR_TYPECHECK (${errors[0].code})`, message: errors[0].message, line: errors[0].line ?? null };
    leg = x3.lower(intent, nowMs);
    request = x3.buildQuoteRequest(leg, TOKENS, { dry: true });
  } catch (e) {
    const f = failure(e);
    return { stage: "compile", code: f.code, message: f.message, line: f.line };
  }
  // check_mandate does not read program_sha256; the hash is only carried into the policy.
  const policy = x3.policyFor(leg, request, "");
  // The Guard refuses at 64 payments in the window, so more than that changes nothing.
  const n = Math.min(x3.MAX_PAYMENTS_PER_WINDOW, Math.max(0, Math.floor(state.paymentsToday)));
  const count = state.spentToday > 0n ? Math.max(1, n) : n;
  // One minute apart, ending a minute ago: every spend is inside the rolling 24 hours.
  const spends = Array.from({ length: count }, (_, i) => ({
    at_ms: nowMs - 60_000 * (i + 1),
    amount: (state.spentToday / BigInt(count) + (i === 0 ? state.spentToday % BigInt(count) : 0n)).toString(),
  }));
  const view = { ...mandate.value, version: null, revoked: state.revoked, spends };
  const checks = x3.checkMandate(view, policy, nowMs);
  if (leg.mandate_owner && leg.mandate_owner !== mandate.value.owner) {
    checks.unshift({ guard: "mandate_owner", ok: false, detail: `${leg.mandate_owner}, mandate owner ${mandate.value.owner}` });
  }
  const approvals = x3.approvalsNeeded(view, policy.amount);
  const decision = checks.some((c) => !c.ok) ? "denied" : approvals ? "approval_required" : "allowed";
  return { stage: "mandate", decision, checks, approvals };
}

export const LESSONS = [
  { title: "Two files, two authors", sub: "The idea", goal: "In .x3 the owner and the AI agent never write the same file. The owner writes a mandate once. The agent writes an intent for every payment. Software compares the two, and only software can say yes." },
  { title: "Read an intent", sub: "Line by line", goal: "The real agent payment from x3lang: 25 USDC from Solana to x3-demo.near on NEAR. Pick any line to see what it means, what it becomes in the NEAR Intents (1Click) request, and what happens if you get it wrong." },
  { title: "Amounts are base units", sub: "No decimals", goal: "Every amount in .x3 is an integer in the token's smallest unit. Type an amount and see what you write." },
  { title: "Guards: the bounds", sub: "Slippage, fees, time, nonce", goal: "Guards are the require, timeout and on_fail lines. Move the controls and watch the source change." },
  { title: "Read a mandate", sub: "The owner's rulebook", goal: "The real mandate: the agent may spend Solana USDC, up to 50 per payment and 200 a day, pay only x3-demo.near, and anything over 30 needs the owner. Pick a line." },
  { title: "Write your own mandate", sub: "Live compiler", goal: "Edit the mandate. It is compiled as you type by the same checker /playground uses, the browser port of x3lang's near_intents.py." },
  { title: "Try to break it", sub: "Compile-time refusals", goal: "A hijacked agent will try to slip something past. Each button applies one of the nine edits x3lang's x3_wont_compile.py runs against the real payment." },
  { title: "Will the Guard let it through?", sub: "The mandate check", goal: "Change the agent's payment, or pick a scenario. The intent is compiled, lowered to its 1Click request, and run through x3-guard's ten mandate checks, live." },
  { title: "Run it for real", sub: "Your terminal", goal: "From the root of the x3lang repo, offline, with Python 3 and x3-lang/requirements.txt. None of these sign, deploy or send anything." },
] as const;

export const STAGES = [
  { name: "Agent writes the intent", does: "A model turns a request into an .x3 payment program.", codes: "untrusted", first: true },
  { name: "Compiler", does: "Parses and type-checks. Refuses missing bounds, unsafe shapes and invalid addresses.", codes: "X3_NEAR_*", first: false },
  { name: "Mandate check", does: "Ten checks against the owner's rules: asset, recipient, caps, refund, slippage, fees, expiry.", codes: "mandate_*", first: false },
  { name: "x3-guard on NEAR", does: "The contract runs the same mandate terms on chain before the agent's intent is registered.", codes: "FINAL refusal or success", first: false },
  { name: "1Click quote check", does: "Signature, amounts, min_receive, slippage and fees are verified before a deposit address is used.", codes: "quote checks", first: false },
] as const;

export const RUNS = [
  { title: "Compile the mandate to the exact create_mandate call", cmd: "python3 x3-lang/near_intents.py mandate args x3-lang/examples/near_mandate_agent.x3 \\\n    --tokens x3-lang/tests/fixtures/near_intents_tokens.json", see: "terms.program_sha256 is the mandate file's own SHA-256." },
  { title: "Check the attack intent against it", cmd: "python3 x3-lang/near_intents.py mandate check x3-lang/examples/near_mandate_agent.x3 \\\n    x3-lang/examples/near_intents_agent_denied.x3 \\\n    --tokens x3-lang/tests/fixtures/near_intents_tokens.json", see: "mandate_recipient: ok false (attacker.near, allowed ['x3-demo.near']); exit 6." },
  { title: "Watch nine unsafe edits fail to compile", cmd: "python3 scripts/hackathon/x3_wont_compile.py", see: "9/9 edits refused at compile time; 9/9 with the expected code." },
  { title: "Every judge gate in one run", cmd: "bash scripts/hackathon/judge_one_command.sh /tmp/x3-shield-judge", see: "Runs every gate and writes the results to the folder you name." },
] as const;
