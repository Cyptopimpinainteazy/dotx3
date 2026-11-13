import { useEffect, useState } from "react";
import type { ExplorerPage } from "@/lib/explorer/client.mjs";
import { BASE_TX, SITUATION_REPORT } from "@/lib/judge-cases";
import { LINKS } from "@/lib/front-door";

/**
 * Shown while live Explorer history is not connected on this deployment: the finalized
 * testnet transactions behind this page's claims, instead of an empty panel.
 */
function RecordedEvidence() {
  const rows = [
    ...SITUATION_REPORT.filter((r) => r.status !== "HELD 8/8"),
    {
      status: "SOURCE",
      tone: "good",
      text: "Base Sepolia leg of the same trade: 1.000000 test USDC sent",
      href: LINKS.baseTx,
      link: `${BASE_TX.slice(0, 10)}…${BASE_TX.slice(-6)}`,
    },
  ] as const;
  return (
    <div className="space-y-4">
      <p className="text-muted">
        Live 1Click Explorer history is not connected on this site yet. Until it is, these are the
        finalized testnet transactions behind the claims on this page. Open any of them on the
        public block explorer.
      </p>
      <ul className="overflow-hidden rounded-xl border border-border bg-surface">
        {rows.map((row) => (
          <li
            key={row.status}
            className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-border px-5 py-3.5 last:border-b-0"
          >
            <span
              className={`w-24 shrink-0 font-mono text-xs font-semibold ${row.tone === "bad" ? "text-accent" : "text-primary"}`}
            >
              {row.status}
            </span>
            <span className="min-w-0 flex-[1_1_16rem] text-sm text-fg">{row.text}</span>
            <a
              href={row.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs break-all text-primary underline-offset-4 hover:underline"
            >
              {row.link}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">
        Testnet only. Explorer records, once connected, are provider-reported and are labeled as
        such; they do not replace these on-chain receipts.
      </p>
    </div>
  );
}

export function ExplorerEvidence() {
  // null while checking; the status endpoint reports presence of the server settings only.
  const [configured, setConfigured] = useState<boolean | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/api/explorer/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { configured: false }))
      .then((d: { configured?: unknown }) => live && setConfigured(d.configured === true))
      .catch(() => live && setConfigured(false));
    return () => {
      live = false;
    };
  }, []);
  const [page, setPage] = useState<ExplorerPage | null>(null);
  const [status, setStatus] = useState("");
  const [scope, setScope] = useState("account");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(
    "Load the configured project history. No wallet connection or transaction signing.",
  );
  async function load(next = false) {
    setBusy(true);
    setMessage("Reading Explorer history…");
    const params = new URLSearchParams({ scope });
    if (status) params.set("statuses", status);
    if (next && page?.nextCursor) {
      params.set("lastDepositAddress", page.nextCursor.lastDepositAddress);
      if (page.nextCursor.lastDepositMemo != null)
        params.set("lastDepositMemo", page.nextCursor.lastDepositMemo);
    }
    try {
      const response = await fetch(`/api/explorer/transactions?${params}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 429)
          throw new Error(
            `Partner request limit reached. Retry in ${response.headers.get("Retry-After") || "5"} seconds.`,
          );
        if (["EXPLORER_NOT_CONFIGURED", "EXPLORER_SCOPE_NOT_CONFIGURED"].includes(data.error)) {
          setConfigured(false);
          return;
        }
        throw new Error("Explorer is unavailable. No settlement conclusion can be drawn.");
      }
      setPage(data);
      setMessage(
        data.transactions.length
          ? "Provider-reported records loaded."
          : "No matching records returned. This does not prove that no swap occurred.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Explorer unavailable.");
    } finally {
      setBusy(false);
    }
  }
  if (configured === false) return <RecordedEvidence />;
  return (
    <div className="space-y-4">
      <p className="text-muted">
        This panel reads live NEAR Intents Explorer history when configured. Records are
        provider-reported · network and chain finality: unverified · independently verified: no.
        They do not establish X3 Guard authorization or cross-chain atomicity.
      </p>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm text-muted">
          Public history scope
          <select
            className="ml-3 min-h-11 rounded border border-border bg-surface p-2 text-fg"
            value={scope}
            disabled={busy}
            onChange={(event) => {
              setScope(event.target.value);
              setPage(null);
              setMessage("Scope changed. Load history for this scope.");
            }}
          >
            <option value="account">Account · dotx3.near</option>
            <option value="referral">Partner referral · x3star</option>
          </select>
        </label>
        <label className="text-sm text-muted">
          Reported status
          <select
            className="ml-3 min-h-11 rounded border border-border bg-surface p-2 text-fg"
            value={status}
            disabled={busy}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(null);
            }}
          >
            <option value="">All statuses</option>
            {[
              "SUCCESS",
              "FAILED",
              "REFUNDED",
              "PROCESSING",
              "PENDING_DEPOSIT",
              "INCOMPLETE_DEPOSIT",
            ].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <button
          className="min-h-11 rounded border border-border px-4 text-fg disabled:opacity-50"
          disabled={busy || configured !== true}
          onClick={() => load()}
        >
          Load history
        </button>
        {page?.nextCursor && (
          <button
            className="min-h-11 rounded border border-border px-4 text-fg disabled:opacity-50"
            disabled={busy}
            onClick={() => load(true)}
          >
            Older records
          </button>
        )}
      </div>
      <p role="status" aria-live="polite" className="text-sm text-muted">
        {message}
      </p>
      {page && (
        <p className="text-sm text-muted">
          Observed: {page.observedAt} · {page.cached ? "Cached response" : "Fresh response"}.
          Previously loaded records remain visible if a refresh fails.
        </p>
      )}
      <div className="grid gap-3">
        {page?.transactions.map((row, index) => (
          <article
            key={`${row.depositAddress}:${row.depositMemo}:${index}`}
            className="min-w-0 rounded-xl border border-border bg-surface p-4"
          >
            <p className="font-display text-fg">
              {row.status} <span className="text-sm text-muted">· Explorer-reported</span>
            </p>
            <dl className="mt-2 grid gap-2 break-all text-sm text-muted">
              <div>
                <dt>Deposit address / memo</dt>
                <dd>
                  {row.depositAddress}
                  {row.depositMemo != null ? ` / ${row.depositMemo}` : ""}
                </dd>
              </div>
              <div>
                <dt>Recipient</dt>
                <dd>{row.recipient || "Not reported"}</dd>
              </div>
              <div>
                <dt>Input</dt>
                <dd>
                  {row.amountInFormatted || "Not reported"} · {row.originAsset}
                </dd>
              </div>
              <div>
                <dt>Output</dt>
                <dd>
                  {row.amountOutFormatted || "Not reported"} · {row.destinationAsset}
                </dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{row.createdAt || "Not reported"}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
