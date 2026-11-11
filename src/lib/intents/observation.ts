/** UI freshness only; a fresh provider observation never authorizes execution. */
export function observationProblem(observedAt: unknown, nowMs: number): string | null {
  if (typeof observedAt !== "string" || !Number.isFinite(nowMs))
    return "invalid observation time";
  const observedMs = Date.parse(observedAt);
  // Canonical server timestamps only. Permit at most five seconds of clock skew.
  if (
    !Number.isFinite(observedMs) ||
    new Date(observedMs).toISOString() !== observedAt ||
    observedMs > nowMs + 5000
  )
    return "invalid observation time";
  if (nowMs - observedMs >= 30000) return "observation expired";
  return null;
}
