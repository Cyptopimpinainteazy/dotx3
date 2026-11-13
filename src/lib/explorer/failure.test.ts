import { test } from "node:test";
import assert from "node:assert/strict";
import { explorerFailureCode, explorerFailureMessage } from "./failure.ts";

test("known codes keep their code and get a specific hint", () => {
  const message = explorerFailureMessage("EXPLORER_AUTH_REJECTED");
  assert.match(message, /\(EXPLORER_AUTH_REJECTED\)/);
  assert.match(message, /rejected this site's Explorer credential/);
  assert.match(message, /No settlement conclusion can be drawn/);
});

test("every client error code a failed lookup can return has a hint", () => {
  for (const code of [
    "EXPLORER_CREDENTIAL_INVALID",
    "EXPLORER_COORDINATOR_UNAVAILABLE",
    "EXPLORER_AUTH_REJECTED",
    "EXPLORER_UPSTREAM_UNAVAILABLE",
    "INVALID_EXPLORER_RESPONSE",
    "INVALID_EXPLORER_CACHE",
    "EXPLORER_UNAVAILABLE",
  ]) {
    assert.doesNotMatch(
      explorerFailureMessage(code),
      /The lookup request was not accepted\./,
      code,
    );
  }
});

test("other codes this site defines are shown with a generic hint", () => {
  assert.match(
    explorerFailureMessage("INVALID_EXPLORER_CURSOR"),
    /\(INVALID_EXPLORER_CURSOR\)\. The lookup request was not accepted\./,
  );
});

test("a well-formed code this site does not define is not shown", () => {
  assert.equal(explorerFailureCode("SOME_UPSTREAM_CODE"), "EXPLORER_UNAVAILABLE");
});

test("the allowlist covers every code the Explorer client throws", async () => {
  const { readFile } = await import("node:fs/promises");
  const client = await readFile(new URL("./client.mjs", import.meta.url), "utf8");
  const thrown = [...client.matchAll(/new ExplorerError\("([A-Z_]+)"/g)].map((m) => m[1]);
  assert.ok(thrown.length > 5);
  for (const code of thrown) assert.equal(explorerFailureCode(code), code, code);
});

test("anything that is not a plain code collapses to EXPLORER_UNAVAILABLE", () => {
  for (const value of [
    undefined,
    null,
    42,
    "",
    "<script>",
    "token=abc.def",
    { error: "X" },
    "a".repeat(80),
  ]) {
    assert.equal(explorerFailureCode(value), "EXPLORER_UNAVAILABLE");
  }
});
