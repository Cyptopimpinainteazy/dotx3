import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const evidence = new URL("../public/evidence/agent-law/", import.meta.url);

test("Agent Law archive retains the three published November 13 records", async () => {
  const provenance = JSON.parse(await readFile(new URL("provenance.json", evidence), "utf8"));
  assert.equal(provenance.source_commit, "98d23cf499d3f17c2a9f29f62bfddaeb1c0ada59");
  assert.equal(provenance.classification, "LOCAL_ONLY_NO_PAYMENT");
  assert.deepEqual(Object.keys(provenance.files).sort(), [
    "lifecycle.json", "python-tests.txt", "verification.json",
  ]);
  for (const [name, record] of Object.entries(provenance.files)) {
    const bytes = await readFile(new URL(name, evidence));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), record.sha256, name);
  }
});

test("archived lifecycle records replay refusal and durable retirement", async () => {
  const record = JSON.parse(await readFile(new URL("lifecycle.json", evidence), "utf8"));
  assert.equal(record.replay_blocked, true);
  assert.equal(record.retired_after_policy_violation, true);
  assert.equal(record.retirement_survives_restart, true);
  assert.equal(record.court_proposal.changes_authority, false);
});
