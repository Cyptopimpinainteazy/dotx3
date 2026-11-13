import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// The "Break the mandate" page restates recorded X3Lang evidence. These checks keep it
// internally honest without network access: the embedded .x3 sources must hash to the
// values the page claims, every visible tag must match the filter data, every repository
// link must use one pinned commit, and the page must contain no network or wallet code.

const html = readFileSync(
  new URL("../public/labs/force-field/index.html", import.meta.url),
  "utf8",
);
const PIN = "f2a01a2ae144c69e115fd807a642bddfd8668f9f";
// The local-node vault evidence and the agent-law status are committed in x3lang #233, on a
// commit beside PIN rather than after it; only those files may be linked at this second commit.
const EVIDENCE_PIN = "7cfde9ffc060f13c5523f5812af541a8b100b14e";
const EVIDENCE_FILES = [
  "evidence/agent-vault-local/complete-path-sandbox-20261113.json",
  "evidence/agent-vault-local/complete-path-sandbox-20261113.txt",
  "docs/security/X3_AGENT_CONSTITUTION_V1.md",
];
const MAINNET_TRAIL = [
  "GFdQLrzT5tnPPdZwKLtmwpNvSwrxVHDvVg2C3WX5fsK6",
  "Eg75uehwU4YJ86ZZPEPKiBqnjkr6PxwPmV23HFAgu153",
  "4zhGYyWNabYQ5gixTUzoVHVbgFKWAsQssSpCv3B1J1LjCRisEJW6wm3zuS2GVuDotAT93S8wm1qezHwsKX2RkXo5",
  "8jfbACLSxrzi3fnajfAVGc4Fgo6XLCWA1mpiJWXPw43P",
  "9sTn9pJ1ZbCVazBm9Wz9oEDh6aWw4FUVMoAJEKCCzuqE",
];
const LAYERS = { compiler: "Compiler", policy: "Policy check", guard: "Guard" };
const EVIDENCE = {
  local: "Local",
  unit: "Guard unit test",
  testnet: "Testnet",
  mainnet: "Mainnet",
};

const unescape = (text) =>
  text.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
const between = (start, end) => {
  const from = html.indexOf(start);
  assert.notEqual(from, -1, start);
  const to = html.indexOf(end, from);
  assert.notEqual(to, -1, end);
  return html.slice(from, to);
};
const cases = [
  ...html.matchAll(
    /<li class="case" id="case-([a-z-]+)" data-layer="([a-z ]+)" data-evidence="([a-z ]+)">([\s\S]*?)<\/li>\n/g,
  ),
];

test("the embedded .x3 sources hash to the SHA-256 values the page shows", () => {
  for (const [name, sha256] of [
    ["mandate", "eea021d5cc1118801f4e1d3b9c0efe89fc59a7f654031f9ff1951aa1f2f3d515"],
    ["payment", "9ee29a5603cfa1e7d9fdbd866cf330ce35e6b5f0907c6844dd2ef1a213768ba0"],
  ]) {
    const source = html.match(new RegExp(`<code data-source="${name}">([\\s\\S]*?)</code>`));
    assert.ok(source, name);
    assert.equal(createHash("sha256").update(unescape(source[1])).digest("hex"), sha256);
    assert.ok(html.includes(`SHA-256 <code>${sha256}</code>`), `${name} hash is shown`);
  }
});

test("the mainnet trail lists the five invoice_06 transactions in order, and copy-all matches", () => {
  const trail = between('id="money"', 'id="check"');
  const linked = [
    ...trail.matchAll(/(?:nearblocks\.io\/txns|solscan\.io\/tx)\/([1-9A-HJ-NP-Za-km-z]{43,88})"/g),
  ].map((m) => m[1]);
  assert.deepEqual(linked, MAINNET_TRAIL);
  assert.ok(trail.includes(`data-copy="${MAINNET_TRAIL.join("&#10;")}"`));
  assert.match(trail, /https:\/\/solscan\.io\/tx\/4zhGYyWN/);
});

test("every attack declares its layer and evidence, and its visible tags say the same", () => {
  assert.equal(cases.length, 12);
  assert.match(html, /Twelve attacks/);
  const ids = new Set();
  for (const [, id, layers, evidence, body] of cases) {
    assert.ok(!ids.has(id), `duplicate case ${id}`);
    ids.add(id);
    const summary = body.match(/<summary>([\s\S]*?)<\/summary>/)[1];
    const shown = [...summary.matchAll(/<span class="tag(?: t-[a-z]+)?">([^<]+)<\/span>/g)].map(
      (m) => m[1],
    );
    const declared = [
      ...layers.split(" ").map((key) => LAYERS[key]),
      ...evidence.split(" ").map((key) => EVIDENCE[key]),
    ];
    assert.ok(declared.every(Boolean), `${id} uses an unknown layer or evidence key`);
    assert.deepEqual(new Set(shown), new Set(declared), id);
    assert.match(body, /<dt>What stopped it<\/dt>/, id);
    assert.match(body, /<dt>(Still allowed|Still possible)<\/dt>/, id);
    assert.match(body, /<dt>Evidence<\/dt>/, id);
  }
});

test("every repository link is pinned to one X3Lang commit, and other links go to the explorers", () => {
  const hrefs = [...html.matchAll(/href="(https?:[^"]+)"/g)].map((m) => m[1]);
  assert.ok(hrefs.length > 30);
  for (const href of hrefs) {
    const url = new URL(href);
    assert.equal(url.protocol, "https:", href);
    if (url.hostname === "github.com") {
      const evidenceFile = EVIDENCE_FILES.find((file) => url.pathname.endsWith(`/${file}`));
      const pin = evidenceFile ? EVIDENCE_PIN : PIN;
      assert.match(
        url.pathname,
        new RegExp(`^/Cyptopimpinainteazy/x3lang/(blob|tree)/${pin}(/|$)`),
        href,
      );
    } else {
      assert.ok(
        ["nearblocks.io", "testnet.nearblocks.io", "solscan.io"].includes(url.hostname),
        href,
      );
    }
  }
  assert.ok(html.includes(`git checkout ${PIN}`));
  assert.ok(
    html.includes(
      `commit <a href="https://github.com/Cyptopimpinainteazy/x3lang/tree/${PIN}"><code>${PIN.slice(0, 7)}</code></a>`,
    ),
  );
});

test("in-page links resolve", () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(ids.has(anchor), `#${anchor}`);
});

test("the custody section shows the four conditions, labelled as local evidence", () => {
  const custody = between('id="custody"', 'id="keys"');
  for (const heading of [
    "Permitted payment executes",
    "Forbidden actions cannot bypass it",
    "Revocation stops later actions",
    "The evidence is preserved",
  ]) {
    assert.ok(custody.includes(`<h3>${heading}</h3>`), heading);
  }
  for (const phrase of [
    "Local evidence only",
    "not testnet or mainnet",
    "RequiresFullAccess",
    "owner revoked mandate",
  ]) {
    assert.ok(custody.includes(phrase), phrase);
  }
  assert.match(custody, /contract's SHA-256 <code>[0-9a-f]{64}<\/code>/);
  assert.ok(custody.includes("bash scripts/hackathon/vault_sandbox_smoke.sh"));
  for (const file of EVIDENCE_FILES) {
    assert.ok(custody.includes(`x3lang/blob/${EVIDENCE_PIN}/${file}`), file);
  }
  const stages = [...custody.matchAll(/<tr><th scope="row">([^<]+)<\/th>/g)].map((m) => m[1]);
  assert.deepEqual(stages, [
    "Birth",
    "Compile",
    "Test",
    "Authorize and execute",
    "Terminate",
    "Court",
    "Evolve",
  ]);
  assert.doesNotMatch(html, /@@[A-Z_]+@@/);
});

test("the limits are on the page, not only the refusals", () => {
  const ends = between('id="ends"', 'id="custody"');
  assert.equal((ends.match(/<strong>Not stopped\.<\/strong>/g) || []).length, 3);
  for (const phrase of [
    "It authenticates neither",
    "not atomic",
    "X3VM is not on the deployed authorization path",
    "about $25",
    "never funded",
  ]) {
    assert.ok(ends.includes(phrase), phrase);
  }
  const keys = between('id="keys"', 'id="money"');
  assert.match(keys, /FullAccess, still present/);
  assert.match(keys, /ed25519:J3NiU8J63HAfz2MTDu1zQVhFRYS5Pio21h1kNtJdP11x/);
  assert.match(keys, /ed25519:8teaXGYFELKQN5QA7gQqeA4B7URrcMQqaczZ5D68c23u/);
});

test("the page has no network, wallet or signing code and loads only the shared export script", () => {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
  const external = scripts.map((m) => m[1].match(/src="([^"]+)"/)?.[1]).filter(Boolean);
  assert.deepEqual(external, ["/page-export-controls.mjs"]);
  const inline = scripts.map((m) => m[2]).join("\n");
  assert.ok(inline.length > 500);
  assert.doesNotMatch(
    inline,
    /\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|window\.ethereum|near-api|wallet-selector|walletSelector|requestSignIn|connectWallet|signAndSend|sendTransaction|\bimport\s*\(|localStorage|indexedDB/i,
  );
});

test("the labs route and site navigation link the page", () => {
  const labs = readFileSync(new URL("../src/routes/labs.tsx", import.meta.url), "utf8");
  const nav = readFileSync(new URL("../src/lib/site-nav.ts", import.meta.url), "utf8");
  assert.match(labs, /path: "\/labs\/force-field\/index\.html"/);
  assert.match(nav, /href: "\/labs\/force-field\/index\.html"/);
});
