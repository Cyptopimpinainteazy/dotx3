import { useEffect, useState } from "react";
import type { ExplorerPage } from "@/lib/explorer/client.mjs";
import { BASE_TX, SITUATION_REPORT } from "@/lib/judge-cases";
import { LINKS } from "@/lib/front-door";
import { explorerFailureMessage } from "@/lib/explorer/failure";

/**
 * Published mainnet evidence and historical testnet records behind this page's claims. Shown
 * while live Explorer history is not connected, and under the error when a live lookup fails,
 * so a broken provider connection never leaves the panel without evidence.
 */
function RecordedEvidence({ intro = true }: { intro?: boolean }) {
  const rows = [
    ...SITUATION_REPORT.filter((r) => r.status !== "HELD 8/8"),
    {
      status: "SOURCE",
      tone: "good",
      text: "Historical Tidepool testnet source: 1.000000 test USDC sent on Base Sepolia",
      href: LINKS.baseTx,
      link: `${BASE_TX.slice(0, 10)}…${BASE_TX.slice(-6)}`,
    },
  ] as const;
  return (
    <div className="space-y-4">
      {intro ? (
        <p className="text-muted">
          Live 1Click Explorer history is not connected on this site yet. This panel shows the
          published mainnet and historical testnet evidence instead. Open each link to inspect its
          archived evidence or public explorer receipt.
        </p>
      ) : (
        <p className="text-sm text-muted">
          Recorded evidence, independent of the live lookup. Open each link to inspect its archived
          evidence or public explorer receipt.
        </p>
      )}
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
        The MAINNET row links to the invoice_06 archive; the other rows are historical testnet
        records. Live Explorer history, once connected, remains provider-reported and does not
        independently prove chain finality, Guard authorization or cross-chain causality.
      </p>
    </div>
  );
}

export function ExplorerEvidence() {
  // null while checking. Recorded evidence renders until the status endpoint (presence of the
  // server settings only) says live history is available, so the server-rendered and
  // no-JavaScript page always shows evidence rather than an inert live panel.
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
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState(
    "Load the configured project history. No wallet connection or transaction signing.",
  );
  async function load(next = false) {
    setBusy(true);
    setFailed(false);
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
        if (data.error === "EXPLORER_NOT_CONFIGURED") {
          setConfigured(false);
          return;
        }
        // Every other failure keeps the recorded evidence on screen beneath the message.
        setFailed(true);
        if (response.status === 429)
          throw new Error(
            `Partner request limit reached. Retry in ${response.headers.get("Retry-After") || "5"} seconds.`,
          );
        if (data.error === "EXPLORER_SCOPE_NOT_CONFIGURED")
          throw new Error("This scope is not enabled on this site. Choose the other scope.");
        throw new Error(explorerFailureMessage(data.error));
      }
      setPage(data);
      setMessage(
        data.transactions.length
          ? "Provider-reported records loaded."
          : "No matching records returned. This does not prove that no swap occurred.",
      );
    } catch (error) {
      // A response that is not JSON, or a network failure, lands here without a code.
      if (!(error instanceof Error) || error instanceof TypeError || error instanceof SyntaxError) {
        setFailed(true);
        setMessage(explorerFailureMessage(undefined));
      } else setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }
  if (configured !== true) return <RecordedEvidence />;
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
          disabled={busy}
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
      {failed && <RecordedEvidence intro={false} />}
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
