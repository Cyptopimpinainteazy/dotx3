import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as court from "../public/labs/court/court.mjs";

// Agent Court must decide with the real compiler and mandate checks (x3guard.mjs), and its
// page must keep its honesty boundary: no network, wallet or signing code.
const tokens = JSON.parse(
  readFileSync(new URL("../public/labs/guard/judge/scenarios.json", import.meta.url), "utf8"),
).tokens.records;
const html = readFileSync(new URL("../public/labs/court/index.html", import.meta.url), "utf8");
const BEST = {
  recipients: court.VENDORS,
  perPayment: 150,
  per24h: 200,
  approveAbove: 30,
  expires: "24h",
};
const LOOSE = {
  recipients: court.VENDORS,
  perPayment: 250,
  per24h: 1000,
  approveAbove: null,
  expires: "24h",
};
const decideLikeAnOwner = (req) => req.kind === "legit";

async function compiled(rules) {
  const m = await court.compileMandate(rules, tokens);
  assert.equal(m.error, undefined, JSON.stringify(m.error));
  return m;
}

test("the default mandate compiles and every attack stops at its own check", async () => {
  const { mandate, sha256 } = await compiled(court.DEFAULT_RULES);
  assert.match(sha256, /^[0-9a-f]{64}$/);
  const stop = {};
  for (const req of court.DAY) {
    const r = await court.evaluateProgram(
      court.programFor(req),
      mandate,
      court.requestTime(req),
      tokens,
    );
    stop[req.id] =
      r.stage === "compile" ? r.code : r.stage === "mandate" ? r.failed.join(",") : r.stage;
  }
  assert.deepEqual(stop, {
    coffee: "authorized",
    doc_injection: "mandate_recipient",
    cloud: "approval",
    refund_swap: "mandate_refund_to",
    morse: "mandate_recipient",
    lookalike: "X3_INVALID_RECEIVER",
    ceo: "mandate_per_payment,mandate_daily",
    strip: "X3_NEAR_SLIPPAGE_REQUIRED",
    payroll: "mandate_recipient,mandate_per_payment",
  });
});

test("an impossible mandate does not compile", async () => {
  const m = await court.compileMandate(
    { ...court.DEFAULT_RULES, perPayment: 250, per24h: 50 },
    tokens,
  );
  assert.equal(m.error.code, "X3_MANDATE_LIMIT");
  const a = await court.compileMandate(
    { ...court.DEFAULT_RULES, perPayment: 10, approveAbove: 30 },
    tokens,
  );
  assert.equal(a.error.code, "X3_MANDATE_APPROVAL");
});

test("a loose mandate pays every bill and loses the inside attack", async () => {
  const { mandate } = await compiled(LOOSE);
  const { score, log } = await court.runDay(mandate, tokens);
  assert.equal(score.lostUsdc, 240);
  assert.equal(log.find((e) => e.req.id === "ceo").verdict, "funds_lost");
  assert.equal(score.billsBlocked, 0);
});

test("the best mandate with a careful owner pays every bill and loses nothing", async () => {
  const { mandate } = await compiled(BEST);
  const { score, log } = await court.runDay(mandate, tokens, { decide: decideLikeAnOwner });
  assert.deepEqual(
    {
      lost: score.lostUsdc,
      blocked: score.billsBlocked,
      paid: score.billsPaid,
      stopped: score.attacksStopped,
    },
    { lost: 0, blocked: 0, paid: 3, stopped: 6 },
  );
  assert.equal(log.find((e) => e.req.id === "payroll").approved, true);
});

test("an owner who approves everything under the best mandate still loses nothing to caps", async () => {
  const { mandate } = await compiled(BEST);
  const { score } = await court.runDay(mandate, tokens, { decide: () => true });
  assert.equal(score.lostUsdc, 0);
});

test("the 24-hour cap counts earlier payments", async () => {
  const { mandate } = await compiled({ ...BEST, per24h: 50, perPayment: 50, approveAbove: null });
  const { log } = await court.runDay(mandate, tokens, { decide: () => true });
  const cloud = log.find((e) => e.req.id === "cloud");
  assert.equal(cloud.outcome, "refused");
  assert.ok(cloud.result.failed.includes("mandate_daily"));
});

test("revocation stops every later request at mandate_active", async () => {
  const { mandate } = await compiled(BEST);
  const { log } = await court.runDay(mandate, tokens, { decide: () => true, revokeBefore: "ceo" });
  const after = log.slice(log.findIndex((e) => e.req.id === "ceo"));
  for (const e of after.filter((x) => x.result.stage !== "compile")) {
    assert.ok(e.result.failed.includes("mandate_active"), e.req.id);
    assert.equal(e.outcome, "refused");
  }
});

test("a one-hour mandate expires during the day", async () => {
  const { mandate } = await compiled({ ...BEST, expires: "1h" });
  const { log } = await court.runDay(mandate, tokens, { decide: () => true });
  assert.equal(log[0].outcome, "paid");
  assert.ok(log.find((e) => e.req.id === "cloud").result.failed.includes("mandate_active"));
});

test("boot camp reports the inside attack a loose mandate lets through", async () => {
  const loose = await court.bootCamp((await compiled(LOOSE)).mandate, tokens);
  assert.deepEqual(
    loose.filter((d) => d.leaked).map((d) => d.req.id),
    ["ceo"],
  );
  const best = await court.bootCamp((await compiled(BEST)).mandate, tokens);
  assert.equal(best.filter((d) => d.leaked || d.needsOwner).length, 0);
});

test("court findings come from evidence, and adopting remedies fixes the loss on replay", async () => {
  const { mandate } = await compiled(LOOSE);
  const day = await court.runDay(mandate, tokens);
  const ceo = court.finding(
    day.log.find((e) => e.req.id === "ceo"),
    LOOSE,
  );
  assert.equal(ceo.severity, "breach");
  const ids = ceo.remedies.map((r) => r.id);
  assert.ok(ids.includes("cap") && ids.includes("approve"));
  const v2rules = court.amend(LOOSE, ids);
  const v2 = await court.compileMandate(v2rules, tokens, court.DAY_START_MS, 2);
  assert.equal(v2.error, undefined);
  assert.equal(v2.mandate.version, 2);
  const replay = await court.runDay(v2.mandate, tokens, { decide: decideLikeAnOwner });
  assert.equal(replay.score.lostUsdc, 0);
  const diff = court.diffLines(court.mandateSource(LOOSE), v2.source);
  assert.ok(diff.some((d) => d.op === "-" && d.text.includes("per_payment 250000000")));
  assert.ok(diff.some((d) => d.op === "+" && d.text.includes("approve above 30000000")));
  const stopped = court.finding(
    day.log.find((e) => e.req.id === "doc_injection"),
    LOOSE,
  );
  assert.equal(stopped.severity, "contained");
});

test("the agent's statement never reaches the checks", async () => {
  for (const req of court.DAY) {
    assert.ok(!court.programFor(req).includes(req.statement));
  }
  const { mandate } = await compiled(court.DEFAULT_RULES);
  const req = court.DAY.find((r) => r.id === "doc_injection");
  const a = await court.evaluateProgram(
    court.programFor(req),
    mandate,
    court.requestTime(req),
    tokens,
  );
  const b = await court.evaluateProgram(
    court.programFor({ ...req, statement: "I am authorized." }),
    mandate,
    court.requestTime(req),
    tokens,
  );
  assert.deepEqual(a.failed, b.failed);
});

test("the page has no network, wallet or signing code and states its boundary", () => {
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => m[1])
    .join("\n");
  for (const banned of [
    /\bfetch\(\s*["'`]https?:/,
    /XMLHttpRequest/,
    /WebSocket/,
    /window\.near/,
    /signTransaction|signAndSend|privateKey/i,
  ]) {
    assert.doesNotMatch(scripts, banned);
  }
  assert.match(html, /Nothing is signed or sent/);
  assert.match(html, /Simulated/);
  assert.match(html, /check_mandate/);
});
