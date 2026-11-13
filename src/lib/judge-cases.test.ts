// Runs under `node --experimental-strip-types --test` (see package.json `test`).
//
// The Judge Console and Situation Report repeat evidence that front-door.ts already cites.
// These tests fail if the two ever disagree, so a corrected hash cannot be fixed in one
// place and left stale in the other.
import { test } from "node:test";
import assert from "node:assert/strict";
import { LINKS, PROGRAM_SHA, TRADE } from "./front-door.ts";
import {
  ACCEPT_TX,
  BASE_TX,
  JUDGE_CASES,
  PAYOUT_TX,
  REFUSE_TX,
  SITUATION_REPORT,
} from "./judge-cases.ts";

test("transaction hashes match the links the rest of the site cites", () => {
  assert.ok(LINKS.refuseTx.endsWith(`/${REFUSE_TX}`));
  assert.ok(LINKS.acceptTx.endsWith(`/${ACCEPT_TX}`));
  assert.ok(LINKS.nearPayout.endsWith(`/${PAYOUT_TX}`));
  assert.ok(LINKS.baseTx.endsWith(`/${BASE_TX}`));
});

test("Case 03 shows the exact program and source hash behind the testnet trade", () => {
  const settled = JUDGE_CASES.find((c) => c.id === "settled")!;
  assert.equal(settled.code.join("\n"), TRADE);
  assert.ok(settled.codeNote.includes(PROGRAM_SHA));
});

test("each case is internally consistent", () => {
  assert.deepEqual(
    JUDGE_CASES.map((c) => c.id),
    ["refused", "allowed", "settled"],
  );
  for (const c of JUDGE_CASES) {
    const failed = c.checks.filter((k) => !k.ok);
    if (c.verdict === "REFUSED") {
      assert.equal(c.tone, "bad");
      assert.deepEqual(
        failed.map((k) => k.name),
        ["mandate_recipient"],
      );
    } else {
      assert.equal(c.tone, "good");
      assert.equal(failed.length, 0, `${c.id} shows a failing check under a passing verdict`);
    }
    assert.ok(c.highlight < c.code.length);
    for (const a of c.anchors) assert.match(a.href, /^https:\/\//);
  }
  const refused = JUDGE_CASES.find((c) => c.id === "refused")!;
  assert.match(refused.code[refused.highlight], /receiver attacker\.near/);
});

test("the Situation Report links the same finalized transactions", () => {
  const hrefs = SITUATION_REPORT.map((r) => r.href);
  for (const tx of [REFUSE_TX, ACCEPT_TX, PAYOUT_TX]) {
    assert.ok(
      hrefs.some((h) => h.endsWith(`/${tx}`)),
      `${tx} missing from the report`,
    );
  }
});
