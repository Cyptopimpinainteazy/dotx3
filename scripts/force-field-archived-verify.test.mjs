import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { verifyArchived, EXPECT } from "../public/labs/force-field/verify-core.mjs";

const dirname = new URL("../public/labs/force-field/evidence/", import.meta.url);
const bytes = (name) => readFileSync(new URL(name, dirname));
const json = (name) => JSON.parse(bytes(name).toString("utf8"));
const SHA = {
  "public-rpc-observation.json": "3e04b9fd801473a52c1f51460c406752ef898877c80bda920c32c8ddb3348be7",
  "independent-finalized-readback.json":
    "829003bb2e94516aff4bf6ab45f9848147ba6a0604f05a149b80e5947ac61165",
  "mandate-proposed.x3": EXPECT.mandate,
  "payment-proposed.x3": EXPECT.payment,
};
const hash = (name) => createHash("sha256").update(bytes(name)).digest("hex");
const run = (
  o = json("public-rpc-observation.json"),
  r = json("independent-finalized-readback.json"),
  hashes = { mandate: hash("mandate-proposed.x3"), payment: hash("payment-proposed.x3") },
) => verifyArchived(o, r, hashes);
const by = (rows, name) => rows.find((r) => r.name === name);
const clone = (obj) => structuredClone(obj);

test("archived copies are byte-for-byte identical to published SHA-256 sums", () => {
  for (const [name, expected] of Object.entries(SHA)) assert.equal(hash(name), expected, name);
});
test("archived evidence yields 20 scoped passes and three unverified limitations", () => {
  const rows = run();
  assert.equal(rows.filter((r) => r.status === "PASS").length, 20);
  assert.equal(rows.filter((r) => r.status === "FAIL").length, 0);
  assert.equal(rows.filter((r) => r.status === "UNVERIFIED").length, 3);
});
test("unexpected quote signer is FAIL", () => {
  const o = json("public-rpc-observation.json");
  o.near_transactions.agent_accept_quote.public_key = "ed25519:attacker";
  assert.equal(by(run(o), "Restricted agent signer").status, "FAIL");
});
test("bad Solana token amount is FAIL", () => {
  const o = json("public-rpc-observation.json");
  o.solana_deposit.post_token_balances[1].amount = "24999999";
  assert.equal(by(run(o), "25 USDC token-balance transfer").status, "FAIL");
});
test("bad payout recipient is FAIL", () => {
  const o = json("public-rpc-observation.json");
  const p = o.near_transactions.payout;
  for (const r of p.receipts)
    r.logs = (r.logs || []).map((l) =>
      l.replaceAll('"new_owner_id":"x3lang.near"', '"new_owner_id":"attacker.near"'),
    );
  assert.equal(by(run(o), "NEAR 24.9952 USDC payout").status, "FAIL");
});
test("one failed guard is FAIL", () => {
  const o = json("public-rpc-observation.json"),
    q = o.near_transactions.agent_accept_quote;
  const arr = JSON.parse(Buffer.from(q.status.SuccessValue, "base64").toString("utf8"));
  arr[0].ok = false;
  q.status.SuccessValue = Buffer.from(JSON.stringify(arr)).toString("base64");
  assert.equal(by(run(o), "21 Guard checks").status, "FAIL");
});
test("missing source bytes never become PASS", () => {
  assert.equal(
    by(run(undefined, undefined, { mandate: null, payment: EXPECT.payment }), "mandate.x3 bytes")
      .status,
    "UNVERIFIED",
  );
});
test("changed outcome amount is FAIL", () => {
  const o = json("independent-finalized-readback.json");
  o.intent_value.outcome.amount_out = "100";
  assert.equal(by(run(undefined, o), "Guard-reported amount").status, "FAIL");
});
test("missing outcome is UNVERIFIED", () => {
  const o = json("independent-finalized-readback.json");
  delete o.intent_value.outcome;
  assert.equal(by(run(undefined, o), "Guard-reported outcome").status, "UNVERIFIED");
});
test("cross-chain causality and custody are never marked PASS", () => {
  const rows = run();
  for (const n of [
    "Cross-chain atomicity",
    "Guard source-wallet custody",
    "Live RPC / consensus verification",
  ]) {
    assert.equal(by(rows, n).status, "UNVERIFIED");
  }
});
test("the new standalone page links from the existing challenge and does no signing", () => {
  const dir = new URL("../public/labs/force-field/", import.meta.url);
  const page = readFileSync(new URL("verify.html", dir), "utf8");
  const index = readFileSync(new URL("index.html", dir), "utf8");
  assert.match(index, /href="\/labs\/force-field\/verify.html"/);
  assert.match(page, /verify-core\.mjs/);
  assert.match(page, /ARCHIVED RPC CHECKS/);
  assert.doesNotMatch(
    page,
    /window\.ethereum|signAndSendTransaction|sendTransaction|wallet\.sign/i,
  );
});

test("verify page links the proof card at a commit that has it", () => {
  const page = readFileSync(
    new URL("../public/labs/force-field/verify.html", import.meta.url),
    "utf8",
  );
  const cards = [...page.matchAll(/x3lang\/blob\/([0-9a-f]{40})\/PROOF_CARD\.md/g)].map(
    (m) => m[1],
  );
  assert.ok(cards.length > 0);
  // PROOF_CARD.md first exists in aa8e3ae; 4f60ddb predates it.
  for (const sha of cards) assert.notEqual(sha, "4f60ddb652188784ed44f64d8172cd2cd84da422");
});
