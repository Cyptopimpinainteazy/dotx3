// Runs under `node --experimental-strip-types --test` (see package.json `test`).
//
// /learn must teach what x3lang actually does. Every result the tutorial shows comes from
// the vendored checker; these tests pin the lessons to it.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  EDITS,
  INTENT_DEFAULTS,
  INTENT_LINES,
  INTENT_NOTES,
  INTENT_SOURCE,
  MANDATE_LINES,
  MANDATE_NOTES,
  MANDATE_SOURCE,
  applyEdit,
  checkIntent,
  compileMandate,
  diffLines,
  intentSource,
  toBaseUnits,
  type GuardState,
  type IntentFields,
} from "./tutorial.ts";

const CLEAN: GuardState = { revoked: false, days: 0, spentToday: 0n, paymentsToday: 0 };
const fields = (patch: Partial<IntentFields> = {}) => intentSource({ ...INTENT_DEFAULTS, ...patch });
const failed = (v: ReturnType<typeof checkIntent>) =>
  v.stage === "mandate" ? v.checks.filter((c) => !c.ok).map((c) => c.guard) : [v.code];

test("every source line has an explanation", () => {
  assert.equal(INTENT_NOTES.length, INTENT_LINES.length);
  assert.equal(MANDATE_NOTES.length, MANDATE_LINES.length);
  assert.equal(MANDATE_LINES[0], "mandate x3_shopping_agent {");
  assert.equal(MANDATE_LINES.at(-1), "}");
});

test("the example mandate compiles to the terms the lessons describe", () => {
  const m = compileMandate(MANDATE_SOURCE);
  assert.ok(m.ok);
  const t = m.value.terms;
  assert.equal(t.per_payment_cap, "50000000");
  assert.equal(t.daily_cap, "200000000");
  assert.deepEqual(t.recipients, ["x3-demo.near"]);
  assert.equal(t.max_slippage_bps, 100);
  assert.equal(t.max_fee_bps, 100);
  assert.equal(t.approval_above, "30000000");
});

test("mandate mistakes fail with the codes lesson 5 names", () => {
  const swap = (from: string, to: string) => compileMandate(MANDATE_SOURCE.replace(from, to));
  const code = (r: ReturnType<typeof compileMandate>) => (r.ok ? "OK" : r.code);
  assert.equal(code(swap("agent x3-agent.near", "agent x3-owner.near")), "X3_MANDATE_ACCOUNT");
  assert.equal(code(swap("per_payment 50000000", "per_payment 500000000")), "X3_MANDATE_LIMIT");
  assert.equal(code(swap("approve above 30000000", "approve above 60000000")), "X3_MANDATE_APPROVAL");
  assert.equal(code(swap("of x3-owner.near", "of x3-agent.near")), "X3_MANDATE_APPROVAL");
  assert.equal(code(swap("    require fees <= 100 bps\n", "")), "X3_MANDATE_BOUND");
  assert.equal(code(swap("    expires 30d\n", "")), "X3_MANDATE_PARSE");
  assert.equal(code(swap("expires 30d", "expires 0d")), "X3_MANDATE_EXPIRES");
});

test("the real agent payment, and the form's default, both pass all ten checks", () => {
  for (const source of [INTENT_SOURCE, fields()]) {
    const v = checkIntent(source, CLEAN);
    assert.equal(v.stage, "mandate");
    if (v.stage !== "mandate") return;
    assert.equal(v.decision, "allowed");
    assert.equal(v.checks.length, 10);
  }
});

test("each lesson 8 scenario stops at the guard it is named for", () => {
  assert.deepEqual(failed(checkIntent(fields({ recipient: "attacker.near" }), CLEAN)), ["mandate_recipient"]);
  assert.deepEqual(failed(checkIntent(fields({ amount: "60" }), CLEAN)), ["mandate_per_payment"]);
  assert.deepEqual(failed(checkIntent(fields(), { ...CLEAN, spentToday: 180_000_000n, paymentsToday: 7 })), ["mandate_daily"]);
  assert.deepEqual(failed(checkIntent(fields({ slippage: "2%" }), CLEAN)), ["mandate_slippage"]);
  assert.deepEqual(failed(checkIntent(fields({ fees: "150" }), CLEAN)), ["mandate_fees"]);
  assert.deepEqual(failed(checkIntent(fields({ refundTo: "So11111111111111111111111111111111111111112" }), CLEAN)), ["mandate_refund_to"]);
  assert.deepEqual(failed(checkIntent(fields({ arrive: "Near.wNEAR" }), CLEAN)), ["mandate_destination_asset"]);
  assert.deepEqual(failed(checkIntent(fields(), { ...CLEAN, revoked: true })), ["mandate_active"]);
  const v = checkIntent(fields({ amount: "40" }), CLEAN);
  assert.ok(v.stage === "mandate" && v.decision === "approval_required" && v.approvals === 1);
});

test("lesson 7: the vendored checker refuses every one of the nine edits", () => {
  assert.equal(EDITS.length, 9);
  for (const edit of EDITS) {
    const edited = applyEdit(edit);
    assert.notEqual(edited, INTENT_SOURCE, `${edit.id} changes nothing`);
    const v = checkIntent(edited, CLEAN);
    assert.equal(v.stage, "compile", `${edit.id} compiled`);
    if (v.stage !== "compile") continue;
    // The page shows the code x3_wont_compile.py records (Python). For amount 0 the browser
    // port refuses at a later step, X3_NEAR_AMOUNT; every other edit gives the same code.
    if (edit.id === "zero_amount") assert.equal(v.code, "X3_NEAR_AMOUNT");
    else assert.equal(v.code, edit.code, edit.id);
  }
});

test("diffs show exactly the edited lines", () => {
  const d = diffLines(INTENT_SOURCE, applyEdit(EDITS[3]));
  assert.deepEqual(d.filter((l) => l.kind !== "same").map((l) => l.kind), ["add"]);
  const r = diffLines(INTENT_SOURCE, applyEdit(EDITS[6]));
  assert.deepEqual(r.filter((l) => l.kind !== "same").map((l) => l.kind), ["del", "add"]);
});

test("base units are exact and refuse anything below one unit", () => {
  assert.deepEqual(toBaseUnits("25", 6), { ok: true, digits: "25000000", value: 25_000_000n });
  const digits = (r: ReturnType<typeof toBaseUnits>) => (r.ok ? r.digits : null);
  assert.equal(digits(toBaseUnits("0.5", 6)), "500000");
  assert.equal(digits(toBaseUnits("1", 24)), "1" + "0".repeat(24));
  assert.equal(toBaseUnits("1.0000001", 6).ok, false);
  assert.equal(toBaseUnits("abc", 6).ok, false);
});
