import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OutLink } from "@/components/code-block";
import { Card, CardGrid, Section, SiteShell } from "@/components/site-shell";
import {
  BURN_AT_UTC,
  FORBIDDEN_CASES,
  FaucetApiError,
  faucetClient,
  formatDx3,
  recallHolder,
  rememberHolder,
  waitMinutes,
  type ClaimResult,
  type FaucetStatus,
  type FaucetTx,
  type FeedEntry,
  type ForbiddenCase,
  type ForbiddenResult,
} from "@/lib/faucet";

const CONTRACT_SOURCE =
  "https://github.com/Cyptopimpinainteazy/x3lang/tree/master/x3-lang/near/dx3-hackathon-coin";
const RUNNER_SOURCE = "https://github.com/Cyptopimpinainteazy/x3lang/tree/edc54b5c03cc87415f69402bf8babe8141243ab3/x3-lang/dx3hack_faucet";

export const Route = createFileRoute("/faucet")({
  head: () => ({
    meta: [
      { title: "Judge faucet · DX3HACK · dotx3.net" },
      {
        name: "description",
        content:
          "Claim 100 DX3HACK, the hackathon-only demo credit, and watch the contract refuse a DEX, a lookalike and a nested account on NEAR.",
      },
    ],
  }),
  component: FaucetPage,
});

const RULES: { rule: string; how: string }[] = [
  {
    rule: "Can't be traded or pooled",
    how: "Only allowlisted holders can register, send or receive. A DEX, bridge or random wallet is refused.",
  },
  {
    rule: "Faucet can't be farmed",
    how: "Only the faucet operator mints, only to direct subaccounts of the judges account, with a per-holder cooldown, a daily cap, max supply and max holders.",
  },
  { rule: "Transfers limited", how: "Every sender except the owner gets a fixed number of transfers per UTC day." },
  {
    rule: "Burns a week after judging",
    how: `At ${BURN_AT_UTC} every balance and the supply read zero and nothing can move. The owner can only move the burn earlier.`,
  },
  {
    rule: "Burn bound to an .x3 program",
    how: "The SHA-256 of dx3hack_burn.x3 is stored at deploy and can't be changed; purge refuses any other program text.",
  },
];

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

function useTurnstile(siteKey: string | null) {
  const ref = useRef<HTMLDivElement | null>(null);
  const widget = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!siteKey || !ref.current) return;
    let cancelled = false;
    const mount = () => {
      if (cancelled || !ref.current || !window.turnstile || widget.current) return;
      widget.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        theme: "dark",
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(null),
        "error-callback": () => setToken(null),
      });
    };
    if (window.turnstile) mount();
    else {
      const existing = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
      const script = existing ?? document.createElement("script");
      if (!existing) {
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.dataset.turnstile = "1";
        document.head.appendChild(script);
      }
      script.addEventListener("load", mount);
    }
    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  const consume = useCallback(() => {
    // Turnstile tokens are single use: take it, then ask for a fresh one.
    const current = token;
    setToken(null);
    if (window.turnstile && widget.current) window.turnstile.reset(widget.current);
    return current;
  }, [token]);

  return { ref, ready: !siteKey || Boolean(token), consume };
}

function TxLine({ tx }: { tx: FaucetTx }) {
  const tone =
    tx.outcome === "success" ? "text-primary" : tx.outcome === "refused" ? "text-accent" : "text-muted";
  return (
    <li className="flex min-w-0 flex-col gap-1 rounded-xl border border-border bg-surface px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
      <span className={`w-24 shrink-0 font-mono text-xs font-semibold uppercase ${tone}`}>{tx.outcome}</span>
      <span className="min-w-0 flex-1 break-all font-mono text-sm text-fg">
        {tx.method}({Object.values(tx.args).join(", ")})
        {tx.reason && <span className="block text-xs text-muted">{tx.reason}</span>}
      </span>
      <a className="shrink-0 font-mono text-xs text-primary underline" href={tx.url} target="_blank" rel="noopener noreferrer">
        {tx.tx_hash.slice(0, 10)}… on NearBlocks
      </a>
    </li>
  );
}

function FaucetPage() {
  const client = useMemo(
    () => faucetClient((import.meta.env.VITE_DX3HACK_FAUCET_URL as string | undefined) || undefined),
    [],
  );
  const [status, setStatus] = useState<FaucetStatus | null>(null);
  const [offline, setOffline] = useState<string | null>(null);
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [claim, setClaim] = useState<ClaimResult | null>(null);
  const [holder, setHolder] = useState<string | null>(null);
  const [refusals, setRefusals] = useState<Partial<Record<ForbiddenCase, ForbiddenResult>>>({});
  const turnstile = useTurnstile(status?.turnstile_site_key ?? null);

  const refresh = useCallback(async () => {
    try {
      const s = await client.status();
      setStatus(s);
      setOffline(null);
      setHolder((h) => h ?? recallHolder(s.holder_parent));
      client.feed().then((f) => setFeed(f.txs)).catch(() => undefined);
    } catch (err) {
      setOffline(err instanceof Error ? err.message : "The faucet runner can't be reached right now.");
    }
  }, [client]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const run = async (label: string, action: () => Promise<void>) => {
    setBusy(label);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof FaucetApiError || err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(null);
      void refresh();
    }
  };

  const onClaim = () =>
    run("claim", async () => {
      const result = await client.claim(turnstile.consume(), holder ?? undefined);
      setClaim(result);
      setHolder(result.holder);
      rememberHolder(result.holder);
    });

  const onForbidden = (kind: ForbiddenCase) =>
    run(kind, async () => {
      const result = await client.forbidden(kind, turnstile.consume());
      setRefusals((r) => ({ ...r, [kind]: result }));
    });

  const contract = status?.contract;
  const live = Boolean(contract?.active && !contract?.paused && !status?.paused_reason);
  const wait = waitMinutes(claim?.state?.claim_wait_sec);

  return (
    <SiteShell
      eyebrow="Judge faucet · DX3HACK"
      title="Claim 100 DX3HACK. Watch the rules hold."
      lede={`A hackathon-only demo credit on NEAR. It has no value, it can't be traded, and it burns itself at ${BURN_AT_UTC}. Each rule is enforced by the contract, and every button here sends a real transaction you can open on NearBlocks.`}
    >
      <Section title="Live contract">
        {offline && !status ? (
          <div className="mx-auto max-w-3xl rounded-xl border border-border bg-surface p-6 text-muted">
            <p className="font-display text-fg">The faucet isn't open yet.</p>
            <p className="mt-2">
              It opens once the DX3HACK contract is deployed and its runner is online. The rules below are what the
              contract enforces either way.
            </p>
            <p className="mt-2 text-xs">{offline}</p>
          </div>
        ) : status && contract ? (
          <CardGrid>
            <Card title="Token">
              <p className="break-all font-mono text-sm text-fg">{status.token}</p>
              <p className="mt-2">
                {status.network} ·{" "}
                {live ? "open" : contract.active ? "paused" : "burned"}
                {status.paused_reason ? ` · ${status.paused_reason}` : ""}
              </p>
              <p className="mt-3">
                <OutLink href={`${status.explorer}/address/${status.token}`}>Contract on NearBlocks</OutLink>
              </p>
            </Card>
            <Card title="Holders and supply">
              <p>
                {contract.holders ?? 0} of {contract.max_holders ?? "?"} holders
              </p>
              <p className="mt-2">
                {formatDx3(contract.minted_total)} of {formatDx3(contract.max_supply)} minted
              </p>
              <p className="mt-2">
                Today: {formatDx3(contract.faucet_minted_today)} of {formatDx3(contract.faucet_daily_cap)}
              </p>
            </Card>
            <Card title="Faucet terms">
              <p>{formatDx3(contract.claim_amount)} DX3HACK per claim</p>
              <p className="mt-2">One claim per holder every {Math.round((contract.claim_cooldown_sec ?? 3600) / 60)} minutes</p>
              <p className="mt-2">Holders are subaccounts of {status.holder_parent}</p>
            </Card>
          </CardGrid>
        ) : (
          <p className="text-center text-muted">Reading the contract…</p>
        )}
      </Section>

      <Section
        title="Claim"
        alt
        intro="You get a fresh holder account (j<n>.judges…) and 100 DX3HACK. Nobody holds a key for that account, so you can claim and inspect it, not spend it."
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
          {status?.turnstile_site_key && <div ref={turnstile.ref} />}
          <button
            type="button"
            onClick={onClaim}
            disabled={!live || !turnstile.ready || busy !== null}
            className="min-h-11 rounded bg-primary px-6 font-display text-bg hover:brightness-110 disabled:opacity-50"
          >
            {busy === "claim" ? "Sending to NEAR…" : holder ? `Claim again for ${holder}` : "Claim 100 DX3HACK"}
          </button>
          {holder && !busy && (
            <button type="button" className="text-xs text-muted underline" onClick={() => { setHolder(null); rememberHolder(null); setClaim(null); }}>
              Use a new holder account instead
            </button>
          )}
          {error && <p className="text-center text-accent" role="alert">{error}</p>}
        </div>
        {claim && (
          <div className="mx-auto mt-6 max-w-3xl">
            <p className="text-center text-fg">
              {claim.claimed ? (
                <>
                  <span className="break-all font-mono">{claim.holder}</span> now holds{" "}
                  <strong>{formatDx3(claim.state?.balance)} DX3HACK</strong>.
                  {wait > 0 && ` It can claim again in ${wait} minutes.`}
                </>
              ) : (
                <>The claim was refused on chain: {claim.reason}</>
              )}
            </p>
            <ul className="mt-4 grid gap-2">
              {claim.txs.map((tx) => (
                <TxLine key={tx.tx_hash} tx={tx} />
              ))}
            </ul>
            {claim.state && (
              <p className="mt-3 text-center">
                <OutLink href={claim.state.url}>Holder account on NearBlocks</OutLink>
              </p>
            )}
          </div>
        )}
      </Section>

      <Section
        title="Try to break it"
        intro="Each button asks the contract to allowlist an account it must reject. The request is signed and sent to NEAR, and the refusal comes back from the chain, not from this page."
      >
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
          {FORBIDDEN_CASES.map((c) => {
            const result = refusals[c.id];
            return (
              <div key={c.id} className="flex flex-col rounded-xl border border-border bg-surface p-5">
                <p className="font-display text-fg">{c.label}</p>
                <p className="mt-2 flex-1 text-sm text-muted">{c.why}</p>
                <button
                  type="button"
                  onClick={() => onForbidden(c.id)}
                  disabled={!live || !turnstile.ready || busy !== null}
                  className="mt-4 min-h-11 rounded border border-primary px-4 text-primary hover:bg-primary/10 disabled:opacity-50"
                >
                  {busy === c.id ? "Sending…" : "Send it"}
                </button>
                {result && (
                  <p className={`mt-3 text-sm ${result.as_expected ? "text-primary" : "text-accent"}`}>
                    {result.as_expected ? "Refused on chain: " : "NOT refused, report this: "}
                    {result.reason ?? result.outcome}{" "}
                    <a className="underline" href={result.url} target="_blank" rel="noopener noreferrer">
                      transaction
                    </a>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="What the contract enforces" alt>
        <ul className="mx-auto grid max-w-3xl gap-3">
          {RULES.map((r) => (
            <li key={r.rule} className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="font-display text-fg">{r.rule}</p>
              <p className="mt-1 text-sm text-muted">{r.how}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-3">
          <OutLink href={CONTRACT_SOURCE}>Contract source and tests</OutLink>
          <OutLink href={RUNNER_SOURCE}>Faucet runner source</OutLink>
        </p>
      </Section>

      {feed.length > 0 && status && (
        <Section title="Recent faucet transactions">
          <ul className="mx-auto grid max-w-4xl gap-2">
            {feed.slice(0, 15).map((t) => (
              <TxLine key={t.seq} tx={{ ...t, url: `${status.explorer}/txns/${t.tx_hash}` }} />
            ))}
          </ul>
        </Section>
      )}
    </SiteShell>
  );
}
