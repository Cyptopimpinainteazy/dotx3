/** Opt-in integration check: real HTTPS Redis, synthetic provider responses. No live provider JWT. */
import assert from "node:assert/strict";
import { randomUUID, createHash } from "node:crypto";
import { createExplorerClient, queryParams } from "../src/lib/explorer/client.mjs";
const url = process.env.X3_EXPLORER_REDIS_URL;
const token = process.env.X3_EXPLORER_REDIS_TOKEN;
if (!url?.startsWith("https://") || !token)
  throw Error("Set HTTPS Redis test credentials in the environment.");
const partner = `integration-${randomUUID()}`;
const prefix = `x3:explorer:${createHash("sha256").update(partner).digest("hex")}`;
const keys = new Set([`${prefix}:lock`]);
const env = {
  X3_EXPLORER_REDIS_URL: url,
  X3_EXPLORER_REDIS_TOKEN: token,
  X3_EXPLORER_SEARCH: JSON.stringify({ account: "dotx3.near", referral: "x3star" }),
  NEAR_INTENTS_EXPLORER_JWT: `test.${Buffer.from(JSON.stringify({ partner_id: partner, key_type: "explorer" })).toString("base64url")}.test`,
};
let upstream = 0;
async function redis(command) {
  const response = await fetch(url, {
    method: "POST",
    redirect: "error",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(5000),
  });
  assert.equal(response.ok, true);
  const data = await response.json();
  assert.equal(data.error, undefined);
  return data.result;
}
const fetchImpl = async (target, options) => {
  if (target === url) {
    const command = JSON.parse(options.body);
    if (command[1]?.startsWith(prefix)) keys.add(command[1]);
    return fetch(target, options);
  }
  assert.ok(String(target).startsWith("https://explorer.near-intents.org/api/v0/transactions?"));
  upstream++;
  return Response.json([
    {
      depositAddress: "synthetic-deposit",
      status: "SUCCESS",
      recipient: "dotx3.near",
      secret: "must-not-leak",
      independentlyVerified: true,
    },
  ]);
};
const first = createExplorerClient({ env, fetchImpl }),
  second = createExplorerClient({ env, fetchImpl });
try {
  const outcomes = await Promise.allSettled([
    first.transactions(),
    second.transactions(new URLSearchParams("scope=referral")),
  ]);
  assert.equal(upstream, 1);
  assert.equal(
    outcomes.filter((r) => r.status === "rejected" && r.reason.status === 429).length,
    1,
  );
  const winner = outcomes.findIndex((r) => r.status === "fulfilled");
  const selected = winner === 0 ? "account" : "referral";
  const page = outcomes[winner].value;
  assert.equal(page.independentlyVerified, false);
  assert.equal(page.executionAllowed, false);
  assert.ok(!JSON.stringify(page).includes("must-not-leak"));
  assert.equal((await second.transactions(new URLSearchParams(`scope=${selected}`))).cached, true);
  assert.equal(upstream, 1);
  const query = queryParams(new URLSearchParams(`scope=${selected}`), env.X3_EXPLORER_SEARCH);
  const cacheKey = `${prefix}:cache:${createHash("sha256").update(query.toString()).digest("hex")}`;
  const ttl = await redis(["TTL", cacheKey]);
  assert.ok(ttl > 0 && ttl <= 30);
  const cooldown = await redis(["PTTL", `${prefix}:lock`]);
  assert.ok(cooldown > 0 && cooldown <= 5000);
  console.log(
    "PASS real HTTPS Redis: atomic concurrency, shared partner limit, cached read, redaction; provider response synthetic. Waiting for actual cache expiry.",
  );
  await new Promise((resolve) => setTimeout(resolve, 31000));
  assert.equal(await redis(["GET", cacheKey]), null);
  assert.equal((await first.transactions(new URLSearchParams(`scope=${selected}`))).cached, false);
  assert.equal(upstream, 2);
  console.log(
    "PASS actual Redis cache expiry and refresh; no live Explorer or SHIELD authentication claimed.",
  );
} finally {
  await redis(["DEL", ...keys]);
}
