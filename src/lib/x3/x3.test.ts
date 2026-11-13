// Runs under `node --experimental-strip-types --test` (see package.json `test`).
//
// 1. The vendored checker matches the exact upstream sources in vendor/PROVENANCE.md.
// 2. In this site's copy, every judge scenario still reaches Python's recorded decision
//    through the same guards, so the playground shows x3lang's answers and not a fork's.
// 3. The programs the site prints really compile under that checker.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import * as judge from "./vendor/judge/judge.mjs";
import * as x3 from "./vendor/x3guard.mjs";
import { MANDATE } from "../front-door.ts";
import { PRESETS, applyAttack, ATTACKS, displayDecision } from "./playground.ts";

const vendor = new URL("./vendor/", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, vendor));
const DATA = JSON.parse(read("judge/scenarios.json").toString("utf8")) as judge.ScenarioData;

test("vendored files match the hashes in PROVENANCE.md", () => {
  const provenance = read("PROVENANCE.md").toString("utf8");
  const rows = [...provenance.matchAll(/^\| `([^`]+)` \| `[^`]+` \| `([0-9a-f]{64})` \|$/gm)];
  assert.equal(rows.length, 6, "PROVENANCE.md lists six files");
  for (const [, file, expected] of rows) {
    const actual = createHash("sha256").update(read(file)).digest("hex");
    assert.equal(actual, expected, `${file} differs from the recorded copy`);
  }
});

for (const scenario of DATA.scenarios) {
  test(`${scenario.id}: this copy reaches Python's decision through the same guards`, async () => {
    const result = await judge.evaluate(DATA, scenario);
    assert.equal(result.decision, scenario.python.decision);
    assert.deepEqual(result.denied_guards, scenario.python.denied_guards);
    assert.ok(judge.agrees(scenario, result));
  });
}

test("the mandate printed on the docs and demo pages is the checked-in mandate and compiles", async () => {
  const body = (source: string) => source.slice(source.search(/^mandate /m));
  assert.equal(MANDATE.trimEnd(), body(DATA.mandate.source).trimEnd());
  const lowered = x3.lowerMandate(
    x3.parseMandate(MANDATE),
    DATA.tokens.records,
    Date.parse(DATA.evaluated_at),
    "0".repeat(64),
  );
  assert.equal(lowered.owner, "x3-owner.near");
});

test("each playground preset is a judge scenario, unedited", () => {
  assert.equal(PRESETS.length, DATA.scenarios.length);
  for (const preset of PRESETS) {
    const scenario = DATA.scenarios.find((s) => s.id === preset.id);
    assert.ok(scenario, `${preset.id} is a scenario`);
    assert.equal(preset.intent, scenario.intent.source);
  }
});

test("every one-click attack on the authorized payment is stopped by exactly what it names", async () => {
  const base = DATA.scenarios.find((s) => s.id === "authorized");
  assert.ok(base);
  for (const attack of ATTACKS) {
    const source = applyAttack(base.intent.source, attack);
    assert.notEqual(source, base.intent.source, `${attack.id} changes the program`);
    const run = judge.evaluate(DATA, {
      intent: { ...base.intent, source },
      assumed_guard_state: null,
    });
    if (attack.kind === "compile") {
      await assert.rejects(
        run,
        (e: unknown) => e instanceof x3.X3Error && e.code === attack.stop,
        attack.id,
      );
    } else {
      const result = await run;
      assert.equal(result.decision, "denied_by_policy", attack.id);
      assert.deepEqual(result.denied_guards, [attack.stop], attack.id);
    }
  }
});

test("both captured 1Click quotes verify, and one changed digit breaks the signature", async () => {
  for (const name of [
    "near_intents_quote_dry_live_capture.json",
    "near_intents_quote_dry_implicit_capture.json",
  ]) {
    const quote = JSON.parse(read(`fixtures/${name}`).toString("utf8"));
    assert.equal((await x3.checkQuoteSignature(quote)).valid, true, name);
    quote.quote.minAmountOut = String(BigInt(quote.quote.minAmountOut) + 1n);
    assert.equal((await x3.checkQuoteSignature(quote)).valid, false, name);
  }
});

test("editing the replay fixture exposes the actual local refusal", async () => {
  const scenario = DATA.scenarios.find(s => s.contract_only);
  assert.ok(scenario);
  const pristine = await judge.evaluate(DATA, scenario);
  assert.equal(displayDecision(true, true, pristine.decision), "contract_only");
  const attack = ATTACKS.find(a => a.stop === "mandate_recipient");
  assert.ok(attack);
  const result = await judge.evaluate(DATA, {
    intent: { ...scenario.intent, source: applyAttack(scenario.intent.source, attack) },
    assumed_guard_state: scenario.assumed_guard_state,
  });
  assert.equal(result.decision, "denied_by_policy");
  assert.equal(displayDecision(false, true, result.decision), "denied_by_policy");
  assert.equal(displayDecision(false, true, "preflight_passed"), "preflight_passed");
});
