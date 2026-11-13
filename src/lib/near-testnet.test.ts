// Runs under `node --experimental-strip-types --test` (see package.json `test`).
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatNear, lookup, LookupError, parseLookup, rpcRequest } from "./near-testnet.ts";

const q = (s: string) => new URLSearchParams(s);
const HASH = "6B6k5kre4mFoBq7RuJNadQgrhEvmgb9WDLepX22CxzUZ";

test("only the fixed read vocabulary parses", () => {
  assert.deepEqual(parseLookup(q("m=status")), { m: "status" });
  assert.deepEqual(parseLookup(q("m=block")), { m: "block", id: "final" });
  assert.deepEqual(parseLookup(q("m=block&id=123")), { m: "block", id: 123 });
  assert.deepEqual(parseLookup(q(`m=block&id=${HASH}`)), { m: "block", id: HASH });
  assert.deepEqual(parseLookup(q("m=account&id=x3lang.testnet")), { m: "account", id: "x3lang.testnet" });
  assert.deepEqual(parseLookup(q(`m=tx&hash=${HASH}&sender=alice.testnet`)), { m: "tx", hash: HASH, sender: "alice.testnet" });
  for (const bad of ["", "m=send_tx", "m=broadcast_tx_commit", "m=query", "m=block&id=-1", "m=block&id=0x12",
    "m=account&id=Alice.testnet", "m=account&id=a", "m=chunk&id=nope", `m=tx&hash=${HASH}`, "m=tx&hash=abc&sender=a.testnet"]) {
    assert.throws(() => parseLookup(q(bad)), LookupError, bad);
  }
});

test("params are rebuilt, never forwarded", () => {
  assert.deepEqual(rpcRequest({ m: "account", id: "a.testnet" }), {
    method: "query", params: { request_type: "view_account", finality: "final", account_id: "a.testnet" },
  });
  assert.deepEqual(rpcRequest({ m: "tx", hash: HASH, sender: "a.testnet" }).params, { tx_hash: HASH, sender_account_id: "a.testnet", wait_until: "NONE" });
});

function fakeFetch(responses: Array<{ status?: number; body?: unknown; throws?: boolean }>) {
  const calls: Array<{ url: string; body: any }> = [];
  const f = (async (url: string, init: RequestInit) => {
    calls.push({ url, body: JSON.parse(String(init.body)) });
    const r = responses.shift()!;
    if (r.throws) throw new TypeError("fetch failed");
    return new Response(JSON.stringify(r.body ?? {}), { status: r.status ?? 200 });
  }) as unknown as typeof fetch;
  return { f, calls };
}

test("falls back to the second RPC when the first is down, and trims the account", async () => {
  const { f, calls } = fakeFetch([
    { throws: true },
    { body: { result: { amount: "5000000000000000000000000", locked: "0", storage_usage: 182, code_hash: "11111111111111111111111111111111", block_height: 9 } } },
  ]);
  const r = await lookup({ m: "account", id: "a.testnet" }, f, ["https://one", "https://two"]);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].url, "https://two");
  assert.equal(calls[1].body.method, "query");
  assert.deepEqual(r, { accountId: "a.testnet", amount: "5000000000000000000000000", locked: "0", storageUsage: 182,
    codeHash: "11111111111111111111111111111111", hasContract: false, blockHeight: 9 });
});

test("RPC errors surface with their cause; unknown accounts are 404", async () => {
  const { f } = fakeFetch([{ body: { error: { name: "HANDLER_ERROR", cause: { name: "UNKNOWN_ACCOUNT", info: {} }, data: "account x.testnet does not exist" } } }]);
  await assert.rejects(lookup({ m: "account", id: "x.testnet" }, f, ["https://one"]), (e: LookupError) => e.code === "UNKNOWN_ACCOUNT" && e.status === 404);
  const down = fakeFetch([{ status: 503 }, { status: 429 }]);
  await assert.rejects(lookup({ m: "status" }, down.f, ["https://one", "https://two"]), (e: LookupError) => e.code === "TESTNET_UNREACHABLE" && e.status === 503);
});

test("block and tx results are summarized", async () => {
  const block = { author: "node0", header: { height: 10, hash: HASH, prev_hash: HASH, timestamp_nanosec: "1700000000000000000" },
    chunks: [{ chunk_hash: HASH, shard_id: 0, height_included: 10, gas_used: 2000000000000, tx_root: "abc" },
      { chunk_hash: HASH, shard_id: 1, height_included: 9, gas_used: 5, tx_root: "11111111111111111111111111111111" }] };
  const { f } = fakeFetch([{ body: { result: block } }]);
  const b = await lookup({ m: "block", id: "final" }, f, ["https://one"]);
  assert.equal(b.gasUsed, "2000000000005");
  assert.equal(b.time, "2023-11-14T22:13:20.000Z");
  assert.deepEqual(b.chunks, [{ hash: HASH, shard: 0, txs: true }]);
  const tx = { status: { SuccessValue: "" }, transaction: { signer_id: "a.testnet", receiver_id: "b.testnet", actions: [{ Transfer: { deposit: "1" } }, "CreateAccount"] },
    transaction_outcome: { outcome: { gas_burnt: 100, logs: [] } }, receipts_outcome: [{ outcome: { gas_burnt: 50, logs: ["hi"] } }] };
  const t = fakeFetch([{ body: { result: tx } }]);
  assert.deepEqual(await lookup({ m: "tx", hash: HASH, sender: "a.testnet" }, t.f, ["https://one"]), {
    hash: HASH, signerId: "a.testnet", receiverId: "b.testnet", status: "succeeded", failure: null, gasBurnt: "150", logs: ["hi"], actions: ["Transfer", "CreateAccount"],
  });
});

test("string-valued (still executing) tx statuses are pending, not a crash", async () => {
  for (const status of ["NotStarted", "Started"]) {
    const t = fakeFetch([{ body: { result: { status, transaction: { signer_id: "a.testnet", receiver_id: "b.testnet", actions: [] } } } }]);
    const r = await lookup({ m: "tx", hash: HASH, sender: "a.testnet" }, t.f, ["https://one"]);
    assert.equal(r.status, "pending");
    assert.equal(r.failure, null);
  }
});

test("formatNear", () => {
  assert.equal(formatNear("1234500000000000000000000000"), "1,234.5000");
  assert.equal(formatNear("1"), "0.0000");
  assert.equal(formatNear(undefined), "0");
});
