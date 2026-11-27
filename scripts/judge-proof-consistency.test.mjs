import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("proof page separates frozen submission from later source-vault evidence", () => {
  const page = source("src/routes/proof.tsx");
  assert.match(page, /Submission snapshot vs\. later evidence/);
  assert.match(page, /73f3f17dfc3529cda59bb7077a31dac6a536833a/);
  assert.match(page, /9ec3b48000bcada0ceb20df85d0d7e5eeed744bb/);
  assert.match(page, /not part of that frozen submission/);
  assert.match(page, /generic near_intents receipt verifier rejects/);
});

test("business claims distinguish Guard approval from the separate source vault", () => {
  const tracks = source("src/lib/near-tracks.ts");
  assert.match(tracks, /later 5-USDC Solana vault pilot used a separate source-vault authorization path and did not call NEAR Guard/);
  assert.doesNotMatch(tracks, /Guard enforces the mandate on NEAR mainnet before any cross-chain payment/);
});

test("site no longer calls the closed unmerged program-binding PR open", () => {
  for (const path of [
    "src/routes/proof.tsx",
    "src/routes/language.tsx",
    "src/lib/front-door.ts",
  ]) {
    const contents = source(path);
    assert.doesNotMatch(contents, /open PR #202|PR #202 is still open/i, path);
    assert.match(contents, /closed, unmerged|closed unmerged|closed without merge/i, path);
  }
});
