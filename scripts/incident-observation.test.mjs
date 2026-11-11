import { test } from "node:test";
import assert from "node:assert/strict";
import { observationProblem } from "../src/lib/intents/observation.ts";
const now = Date.parse("2026-11-11T12:00:00.000Z");
const stamp = (offset) => new Date(now + offset).toISOString();

test("missing, malformed and noncanonical observation times are unknown", () => {
  for (const value of [null, undefined, "", "not-a-time", {}, 123, "2026-11-11", "2026-11-11T12:00:00Z"])
    assert.equal(observationProblem(value, now), "invalid observation time");
  assert.equal(observationProblem(stamp(0), NaN), "invalid observation time");
});
test("future observations have a bounded five-second clock-skew tolerance", () => {
  assert.equal(observationProblem(stamp(0), now), null);
  assert.equal(observationProblem(stamp(5000), now), null);
  assert.equal(observationProblem(stamp(5001), now), "invalid observation time");
  assert.equal(observationProblem(stamp(3600000), now), "invalid observation time");
});
test("observations expire at exactly thirty seconds", () => {
  assert.equal(observationProblem(stamp(-29999), now), null);
  assert.equal(observationProblem(stamp(-30000), now), "observation expired");
  assert.equal(observationProblem(stamp(-30001), now), "observation expired");
});
