import { useEffect, useState } from "react";
import { observationProblem } from "@/lib/intents/observation";
import type { ShieldReport } from "@/lib/intents/shield.mjs";
export function ProviderIncidents() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const [data, setData] = useState<ShieldReport | null>(null);
  const [busy, setBusy] = useState(false);
  async function check() {
    setBusy(true);
    setData(null);
    try {
      const r = await fetch("/api/shield/incidents", { cache: "no-store" });
      if (!r.ok) throw Error();
      setData(await r.json());
    } catch {
      setData({ status: "unknown", securityMode: "unknown", observedAt: null, incidents: [] });
    } finally {
      setBusy(false);
    }
  }
  const observedAt = typeof data?.observedAt === "string" ? data.observedAt : null;
  const timeProblem = data && data.status !== "unknown"
    ? observationProblem(data.observedAt, now)
    : null;
  return (
    <section className="my-8 rounded-xl border border-border bg-surface p-5">
      <h2 className="font-display text-2xl text-primary">Provider incident feed</h2>
      <p className="mt-3 text-muted">
        Official NEAR Intents SHIELD, separate from X3 Force Field. An operational response means no
        active incidents were reported at observation time; it does not certify chain health or
        authorize a payment.
      </p>
      <button
        className="my-4 min-h-11 rounded border border-border px-4"
        disabled={busy}
        onClick={check}
      >
        {busy ? "Checking…" : "Check provider incidents"}
      </button>
      <div role="status">
        <p>
          {data
            ? `Incident response: ${timeProblem ? `unknown (${timeProblem})` : data.status}. Surface security mode: unknown.`
            : "Not checked. Provider condition is unknown."}
        </p>
        {observedAt && (
          <p className="text-sm text-muted">
            Observed {observedAt}. Refresh before relying on this observation.
          </p>
        )}
        {data?.reason === "not-configured" && (
          <p className="text-muted">SHIELD read access is not configured.</p>
        )}
        {!timeProblem &&
          data?.incidents.map((r, i) => (
            <p className="mt-2 break-words" key={i}>
              {r.scopeType}: {r.scopeValue} · {r.direction || "direction unspecified"} ·{" "}
              {r.publicDescription || "No public description supplied"}
            </p>
          ))}
      </div>
    </section>
  );
}
