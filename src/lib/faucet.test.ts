import assert from "node:assert/strict";
import { test } from "node:test";
import { FaucetApiError, faucetClient, formatDx3, normalizeBase, waitMinutes } from "./faucet.ts";

test("formats DX3HACK base units without floating point", () => {
  assert.equal(formatDx3("100000000"), "100");
  assert.equal(formatDx3("1000000000000000"), "1,000,000,000");
  assert.equal(formatDx3("1500000"), "1.5");
  assert.equal(formatDx3("1"), "0.000001");
  assert.equal(formatDx3(undefined), "0");
  assert.equal(formatDx3("-5"), "0");
});

test("waits are rounded up to whole minutes", () => {
  assert.equal(waitMinutes(0), 0);
  assert.equal(waitMinutes(3600), 60);
  assert.equal(waitMinutes(61), 2);
  assert.equal(waitMinutes(undefined), 0);
  assert.equal(waitMinutes(Number.NaN), 0);
});

test("the faucet API must be https (or local)", () => {
  assert.equal(normalizeBase(undefined), "https://faucet.x3star.net");
  assert.equal(normalizeBase("https://faucet.example.org/"), "https://faucet.example.org");
  assert.equal(normalizeBase("http://127.0.0.1:8791"), "http://127.0.0.1:8791");
  assert.throws(() => normalizeBase("http://faucet.example.org"));
});

test("claims post only what the runner expects and surface its errors", async () => {
  const calls: { url: string; body: unknown }[] = [];
  const fake = (async (url: string, init?: RequestInit) => {
    calls.push({ url, body: init?.body ? JSON.parse(String(init.body)) : null });
    if (url.endsWith("/claim")) {
      return new Response(JSON.stringify({ error: { code: "cooldown", message: "claimed recently" } }), {
        status: 429,
      });
    }
    return new Response(JSON.stringify({ txs: [] }), { status: 200 });
  }) as typeof fetch;
  const client = faucetClient("https://faucet.example.org", fake);
  await assert.rejects(client.claim("tok", "j1.judges.x3lang.near"), (err: unknown) => {
    assert.ok(err instanceof FaucetApiError);
    assert.equal(err.code, "cooldown");
    assert.equal(err.status, 429);
    return true;
  });
  assert.deepEqual(calls[0], {
    url: "https://faucet.example.org/v1/faucet/claim",
    body: { turnstileToken: "tok", holder: "j1.judges.x3lang.near" },
  });
  await client.forbidden("dex", null);
  assert.deepEqual(calls[1].body, { case: "dex" });
  assert.deepEqual(await client.feed(), { txs: [] });
});

test("an unreachable runner is reported, not thrown raw", async () => {
  const down = (async () => {
    throw new TypeError("fetch failed");
  }) as typeof fetch;
  await assert.rejects(faucetClient(undefined, down).status(), (err: unknown) => {
    assert.ok(err instanceof FaucetApiError);
    assert.equal(err.code, "unreachable");
    return true;
  });
});
