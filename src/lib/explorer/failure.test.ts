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

test("unknown but well-formed codes are shown with a generic hint", () => {
  assert.match(
    explorerFailureMessage("INVALID_EXPLORER_CURSOR"),
    /\(INVALID_EXPLORER_CURSOR\)\. The lookup request was not accepted\./,
  );
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
