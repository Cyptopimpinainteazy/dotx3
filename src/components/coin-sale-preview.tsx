import { useState } from "react";
import example from "../../vendor/x3lang/x3-lang/coin/examples/ten_chain_sale.json";

type SalePlan = {
  status: "quote_only";
  amount: string;
  destination: string;
  shares: { network: string; charge: string; remote_payable: string }[];
  destination_local_share: string;
  destination_receivable: string;
  destination_float_after_delivery: string;
};

// Convert between the editor's decimal display and the API's integer strings.
// The canonical planner determines allocations and checks every inventory.
function displayUnits(base: string) {
  const digits = base.padStart(example.decimals + 1, "0");
  const whole = digits.slice(0, -example.decimals);
  const fraction = digits.slice(-example.decimals).replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
}

function baseUnits(value: string) {
  const [whole, fraction = ""] = value.trim().split(".");
  if (!/^\d+(?:\.\d+)?$/.test(value.trim()) || fraction.length > example.decimals) {
    throw new Error(`Enter a token amount with up to ${example.decimals} decimal places.`);
  }
  return (whole + fraction.padEnd(example.decimals, "0")).replace(/^0+(?=\d)/, "");
}

export function CoinSalePreview() {
  const [amount, setAmount] = useState(displayUnits(example.amount));
  const [plan, setPlan] = useState<SalePlan | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function quote() {
    setPlan(null);
    setError("");
    setBusy(true);
    try {
      const spec = { ...example, amount: baseUnits(amount) };
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "coin-sale-v1", spec }),
        signal: AbortSignal.timeout(20000),
      });
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("The sale planner is unavailable.");
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The sale could not be quoted.");
      if (result.status !== "quote_only" || !Array.isArray(result.shares)) {
        throw new Error("The planner returned an incomplete quote.");
      }
      setPlan(result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The sale could not be quoted.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5 md:p-8">
      <h2 className="font-display text-2xl text-fg">Ten-network sale preview</h2>
      <p className="mt-2 max-w-3xl text-muted">
        In this example, one million tokens are already issued. Ten networks each have a
        100,000-token selling quota. Enter a purchase on Ethereum to see what each quota contributes
        and how much Ethereum must deliver from its prefunded balance.
      </p>
      <form
        className="mt-5 flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          void quote();
        }}
      >
        <label className="min-w-0 text-sm text-fg">
          Tokens to buy on Ethereum
          <input
            value={amount}
            disabled={busy}
            inputMode="decimal"
            maxLength={80}
            required
            onChange={(event) => {
              setAmount(event.target.value);
              setPlan(null);
              setError("");
            }}
            className="mt-1 block min-h-11 w-full rounded-md border border-border bg-bg px-3 font-mono text-fg"
          />
        </label>
        <button
          disabled={busy}
          className="min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-bg disabled:opacity-50"
        >
          {busy ? "Calculating…" : "Preview purchase"}
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-4 text-accent">
          {error}
        </p>
      )}
      {plan && (
        <div className="mt-6 border-t border-border pt-5" aria-live="polite">
          <h3 className="font-display text-xl text-primary">
            {displayUnits(plan.amount)} tokens to the buyer on Ethereum
          </h3>
          <p className="mt-2 max-w-3xl text-muted">
            Ethereum would fund {displayUnits(plan.destination_local_share)} tokens from its own
            quota and advance {displayUnits(plan.destination_receivable)} for the other networks.
            Its spendable inventory immediately after delivery would be{" "}
            {displayUnits(plan.destination_float_after_delivery)} tokens.
          </p>
          <table className="my-4 w-full max-w-2xl text-left text-sm">
            <caption className="sr-only">Proposed sale allocation in whole tokens</caption>
            <thead>
              <tr className="border-b border-border text-muted">
                <th scope="col" className="py-2">
                  Network
                </th>
                <th scope="col" className="px-2 text-right">
                  Quota used
                </th>
                <th scope="col" className="text-right">
                  Owed to Ethereum
                </th>
              </tr>
            </thead>
            <tbody>
              {plan.shares.map((row) => (
                <tr key={row.network} className="border-b border-border">
                  <th scope="row" className="py-2 font-normal capitalize">
                    {row.network}
                  </th>
                  <td className="px-2 text-right font-mono">{displayUnits(row.charge)}</td>
                  <td className="text-right font-mono">{displayUnits(row.remote_payable)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm text-muted">
            Quote only. Delivery, inventory reservations and cross-chain settlement require
            connected contracts.
          </p>
        </div>
      )}
    </section>
  );
}
