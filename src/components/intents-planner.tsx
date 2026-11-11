import { useState } from "react";
import { planDeadline, genericPublicFees } from "@/lib/intents/planning";
export function IntentsPlanner() {
  const [estimate, setEstimate] = useState("35");
  const [dry, setDry] = useState(false);
  const [bps, setBps] = useState("0");
  const [stable, setStable] = useState(true);
  const [auth, setAuth] = useState(true);
  const [result, setResult] = useState("");
  function run() {
    const now = Date.now();
    const d = planDeadline({
      dry,
      nowMs: now,
      estimateSeconds: Number(estimate) * 60,
      defaultSeconds: 1800,
      maximumSeconds: 3600,
      ownerExpiresMs: now + 3600000,
    });
    try {
      const f = genericPublicFees(Number(bps), auth, stable);
      setResult(
        `${d.reason}. Deadline: ${d.deadline || "none"}. Generic public-swap illustration: ${f.total} bps total (${f.developer} application, ${f.provider} provider). ${f.withinCap ? "Within the illustrated 500 bps cap." : "Exceeds the illustrated fee cap."} Protocol, network, withdrawal and price-improvement costs are separate. No fee is activated.`,
      );
    } catch (e) {
      setResult((e as Error).message);
    }
  }
  const input = "ml-2 w-24 rounded border border-border bg-bg p-2 text-fg";
  return (
    <section className="my-8 rounded-xl border border-border bg-surface p-5">
      <h2 className="font-display text-2xl text-primary">Quote planning lab</h2>
      <p className="mt-3 text-muted">
        Local illustration, not a live quote. Standard window: 30 minutes; maximum and owner window:
        60 minutes. Requote and verify signatures before any execution. Generic fee policy may
        differ from your agreement.
      </p>
      <div className="my-4 flex flex-wrap gap-4">
        <label>
          Estimate (minutes)
          <input
            type="number"
            min="1"
            className={input}
            value={estimate}
            onChange={(e) => {
              setEstimate(e.target.value);
              setResult("");
            }}
          />
        </label>
        <label>
          App fee (bps)
          <input
            type="number"
            min="0"
            max="500"
            className={input}
            value={bps}
            onChange={(e) => {
              setBps(e.target.value);
              setResult("");
            }}
          />
        </label>
      </div>
      <div className="my-4 flex flex-wrap gap-4">
        {[
          ["Dry quote", dry, setDry],
          ["Authenticated schedule", auth, setAuth],
          ["Stablecoin / same asset", stable, setStable],
        ].map(([name, value, set]) => (
          <label key={String(name)} className="flex min-h-11 items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => {
                (set as (v: boolean) => void)(e.target.checked);
                setResult("");
              }}
            />
            {String(name)}
          </label>
        ))}
      </div>
      <button
        className="min-h-11 rounded border border-border px-4 hover:border-primary"
        onClick={run}
      >
        Calculate locally
      </button>
      <p className="mt-4 text-muted" role="status">
        {result || "No calculation yet. This lab never sends funds."}
      </p>
    </section>
  );
}
