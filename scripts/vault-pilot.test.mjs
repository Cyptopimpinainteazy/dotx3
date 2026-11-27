import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/vault-pilot.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText;
const {
  VAULT_PILOT: pilot,
  VAULT_PILOT_LINKS: links,
  VAULT_PILOT_LIMITS: limits,
} = await import("data:text/javascript;base64," + Buffer.from(compiled).toString("base64"));
const archived = JSON.parse(
  readFileSync(
    new URL("../public/evidence/mainnet-vault-pilot-20261114.json", import.meta.url),
    "utf8",
  ),
);

test("published outcome matches the fixed mainnet settlement archive", () => {
  assert.equal(pilot.amountIn, "5.000000");
  assert.equal(pilot.amountOut, archived.outputUsdc);
  assert.equal(pilot.minimumOut, archived.minimumUsdc);
  assert.equal(pilot.sourceTx, archived.sourceSignature);
  assert.equal(pilot.payoutTx, archived.destinationTransaction);
  assert.equal(pilot.recipient, archived.recipient);
  assert.equal(pilot.sourceCommit, archived.sourceCommit);
  assert.equal(archived.status, "settled");
  assert.equal(archived.destinationFinality, "FINAL");
});

test("published custody and post-policy state match the captured source state", () => {
  assert.equal(
    pilot.policy,
    archived.policyState ? "ATXS8Y9cDVAN3BxTDa7CXt7FuHU7Y6LJHDqGDDuQtXGC" : null,
  );
  assert.equal(pilot.agent, archived.policyState.agent);
  assert.equal(pilot.vault, archived.policyState.vault_token);
  assert.equal(pilot.nonce, archived.policyState.last_nonce);
  assert.equal(pilot.approvalConsumed, !archived.policyState.pending);
  assert.equal(archived.vaultBalanceBaseUnits, 0);
  assert.equal(archived.policyState.max_per_payment, 5000000);
  assert.equal(archived.policyState.max_per_day, 5000000);
  assert.equal(archived.policyState.spends.length, 1);
  assert.equal(archived.policyState.spends[0].amount, 5000000);
});

test("proof links stay pinned and chain receipts identify the captured transactions", () => {
  for (const name of ["proof", "summary", "verify", "quote"]) {
    assert.ok(links[name].includes("/" + pilot.sourceCommit + "/"));
  }
  assert.ok(links.approval.endsWith(pilot.approvalTx));
  assert.ok(links.source.endsWith(pilot.sourceTx));
  assert.ok(links.payout.endsWith(pilot.payoutTx));
});

test("public limits preserve owner approval and the evidence boundary", () => {
  assert.equal(archived.cryptographicSolverCausalityProven, false);
  assert.equal(archived.sourceQuorumVerified, false);
  assert.equal(archived.genericReceiptVerifierPass, false);
  assert.match(limits.join(" "), /owner approved this exact quote/i);
  assert.match(limits.join(" "), /no new NEAR Guard call/i);
  assert.match(limits.join(" "), /one RPC per chain/i);
});
