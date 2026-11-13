// Runs under `node --experimental-strip-types --test` (see package.json `test`).
import { test } from "node:test";
import assert from "node:assert/strict";
import { EXPLORER_ENV_KEYS, explorerConfigured } from "./configured.ts";

const full = Object.fromEntries(EXPLORER_ENV_KEYS.map((k) => [k, "set"]));

test("configured only when every Explorer setting is present and non-blank", () => {
  assert.equal(explorerConfigured(full), true);
  assert.equal(explorerConfigured({}), false);
  for (const key of EXPLORER_ENV_KEYS) {
    assert.equal(explorerConfigured({ ...full, [key]: undefined }), false, `${key} missing`);
    assert.equal(explorerConfigured({ ...full, [key]: "   " }), false, `${key} blank`);
  }
});

test("the keys match what the Explorer client reads", async () => {
  const { readFileSync } = await import("node:fs");
  const client = readFileSync(new URL("./client.mjs", import.meta.url), "utf8");
  for (const key of EXPLORER_ENV_KEYS)
    assert.ok(client.includes(`env.${key}`), `client does not read env.${key}`);
});
