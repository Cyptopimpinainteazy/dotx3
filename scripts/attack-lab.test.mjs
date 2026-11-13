import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  createLedger,
  LEGIT_REQUEST,
  SCENARIOS,
  runScenario,
  submitToLedger,
} from "../public/labs/attack/attack-lab-policy.mjs";

const expected = {
  allowed: "POLICY_PREVIEW_ALLOWED",
  redirect: "RECIPIENT_DENIED",
  impostor: "AGENT_DENIED",
  oversize: "PER_PAYMENT_CAP",
  drain: "TOTAL_BUDGET_EXCEEDED",
  replay: "NONCE_REPLAY",
  revoked: "MANDATE_REVOKED",
  expired: "MANDATE_EXPIRED",
  direct: "ACCESS_KEY_SCOPE",
  smuggle: "INVALID_AMOUNT",
};
for (const [id, code] of Object.entries(expected)) {
  test(`offline vault preview: ${id}`, () => {
    const scenario = SCENARIOS.find((item) => item.id === id);
    assert.ok(scenario);
    const result = runScenario(scenario);
    assert.equal(result.final.trace.decision.code, code);
    assert.equal(result.final.trace.decision.allowed, id === "allowed");
  });
}
test("denied requests preserve the session ledger; replay consumes no additional budget", () => {
  const initial = createLedger();
  const denied = submitToLedger(initial, { ...LEGIT_REQUEST, recipient: "attacker.testnet" });
  assert.equal(denied.ledger, initial);
  assert.equal(initial.spent, 0n);
  assert.deepEqual(initial.used, []);
  const first = submitToLedger(initial, LEGIT_REQUEST);
  const replay = submitToLedger(first.ledger, LEGIT_REQUEST);
  assert.equal(replay.trace.decision.code, "NONCE_REPLAY");
  assert.equal(replay.ledger, first.ledger);
  assert.deepEqual(first.ledger.used, ["pay-1"]);
});
test("request-supplied accounting cannot reset session spend or used nonces", () => {
  const first = submitToLedger(createLedger(), { ...LEGIT_REQUEST, amount: "0.2", nonce: "first" });
  const second = submitToLedger(first.ledger, { ...LEGIT_REQUEST, amount: "0.2", nonce: "second" });
  const drain = submitToLedger(second.ledger, {
    ...LEGIT_REQUEST,
    nonce: "third",
    spent: "0",
    used: [],
  });
  assert.equal(drain.trace.decision.code, "TOTAL_BUDGET_EXCEEDED");
  assert.equal(drain.ledger, second.ledger);
});
test("copied Attack Lab bytes match the pinned branch provenance", () => {
  const manifest = JSON.parse(
    readFileSync(new URL("../public/labs/attack/provenance.json", import.meta.url)),
  );
  assert.equal(manifest.commit, "efb514ffef2cdfdeb8ad8147747887c85356073c");
  const fullManifest = JSON.parse(readFileSync(new URL("../x3lang-port.json", import.meta.url)));
  assert.equal(manifest.commit, fullManifest.commit);
  assert.deepEqual(manifest.files, fullManifest.files.filter(row => row.destination.startsWith("public/labs/attack/")));
  for (const row of manifest.files) {
    const data = readFileSync(new URL(`../${row.destination}`, import.meta.url));
    assert.equal(createHash("sha256").update(data).digest("hex"), row.sha256);
  }
});
