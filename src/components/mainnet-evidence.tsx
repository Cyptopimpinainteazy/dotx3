import { OutLink, Tag } from "@/components/code-block";
import { EVIDENCE_SNAPSHOT, LINKS, MAINNET, MAINNET_LIMITS } from "@/lib/front-door";

const short = (value: string, head = 8, tail = 6) =>
  value.length > head + tail + 1 ? `${value.slice(0, head)}…${value.slice(-tail)}` : value;

/**
 * invoice_06, the mainnet settlement under an owner's .x3 mandate. Shown on the home page,
 * the proof page and the Judge Console. The seven limits always render with the receipts.
 */
export function MainnetEvidence({ compact = false }: { compact?: boolean }) {
  const steps = [
    {
      label: "1 · Owner approved",
      chain: "NEAR mainnet",
      value: "approve_intent",
      detail: "x3lang.near approved this intent before any agent call.",
      tx: MAINNET.approvalTx,
      href: LINKS.mainnetApprovalTx,
    },
    {
      label: "2 · Guard accepted",
      chain: "NEAR mainnet",
      value: `${MAINNET.guardChecks} / ${MAINNET.guardChecks} checks`,
      detail:
        "The agent's restricted key accepted the signed 1Click quote. The receipt returns 21 guards, all passing: recipient, asset, caps, refund, slippage, fees, approval, deadline and quote terms.",
      tx: MAINNET.guardTx,
      href: LINKS.mainnetGuardTx,
    },
    {
      label: "3 · Deposited",
      chain: "Solana mainnet",
      value: `${MAINNET.amountIn} USDC`,
      detail:
        "The owner signed the deposit to the quoted address from the funding wallet named in the mandate.",
      tx: MAINNET.depositTx,
      href: LINKS.mainnetDepositTx,
    },
    {
      label: "4 · Delivered",
      chain: "NEAR mainnet",
      value: `${MAINNET.amountOut} USDC`,
      detail: "intents.near paid native USDC to x3lang.near, 84 seconds after the deposit.",
      tx: MAINNET.payoutTx,
      href: LINKS.mainnetPayoutTx,
    },
    {
      label: "5 · Outcome recorded",
      chain: "NEAR mainnet",
      value: "Settled · floor met",
      detail:
        "The restricted agent key recorded the settlement on Guard: 24995200 out, both transaction hashes stored.",
      tx: MAINNET.outcomeTx,
      href: LINKS.mainnetOutcomeTx,
    },
  ];

  return (
    <div className="space-y-6" data-mainnet-evidence>
      <div className="flex flex-wrap justify-center gap-2">
        <Tag>Mainnet · Solana → NEAR</Tag>
        <Tag>Signed 1Click quote</Tag>
        <Tag>Nonce {MAINNET.nonce}</Tag>
      </div>
      <p className="mx-auto max-w-3xl text-center text-lg text-fg">
        The owner wrote the rules in .x3. A restricted agent key got the payment past Guard&apos;s
        21 checks. The owner funded 25 USDC on Solana, and 24.9952 USDC reached{" "}
        <span className="font-mono">{MAINNET.owner}</span> on NEAR.
      </p>

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step) => (
          <li
            key={step.label}
            className="flex min-w-0 flex-col rounded-xl border border-border bg-surface p-4"
          >
            <p className="text-xs font-semibold text-muted">{step.label}</p>
            <p className="font-mono text-[11px] tracking-wide text-muted uppercase">{step.chain}</p>
            <p className="mt-2 font-display text-xl text-primary">{step.value}</p>
            {compact ? null : <p className="mt-2 text-sm text-muted">{step.detail}</p>}
            <p className="mt-auto pt-3 font-mono text-xs break-all">
              <OutLink href={step.href}>{short(step.tx)}</OutLink>
            </p>
          </li>
        ))}
      </ol>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.2fr]">
        <article className="min-w-0 rounded-xl border border-border bg-surface p-5">
          <h3 className="font-display text-lg text-fg">The .x3 source matches</h3>
          <p className="mt-2 text-sm text-muted">
            The original files hash to the values Guard stores for this intent and mandate (v4).
          </p>
          <dl className="mt-3 space-y-2 font-mono text-xs">
            <div>
              <dt className="text-muted">payment-proposed.x3</dt>
              <dd className="break-all">
                <OutLink href={LINKS.mainnetPaymentSource}>{MAINNET.paymentSha256}</OutLink>
              </dd>
            </div>
            <div>
              <dt className="text-muted">mandate-proposed.x3</dt>
              <dd className="break-all">
                <OutLink href={LINKS.mainnetMandateSource}>{MAINNET.mandateSha256}</OutLink>
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs">
            <OutLink href={LINKS.mainnetSourceRecovery}>How to check the hashes</OutLink>
          </p>
        </article>

        <article className="min-w-0 rounded-xl border border-border bg-surface p-5">
          <h3 className="font-display text-lg text-fg">Accounts and keys</h3>
          <dl className="mt-3 space-y-2 text-xs">
            <div>
              <dt className="text-muted">Guard contract · code hash</dt>
              <dd className="font-mono break-all">
                <OutLink href={LINKS.mainnetGuardAccount}>{MAINNET.owner}</OutLink> ·{" "}
                {short(MAINNET.guardCodeHash)}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Agent key that signed (FunctionCall, 3 Guard methods)</dt>
              <dd className="font-mono break-all">
                <OutLink href={LINKS.mainnetAgentAccount}>{MAINNET.agent}</OutLink> ·{" "}
                {short(MAINNET.agentFunctionCallKey, 14)}
              </dd>
            </div>
            <div>
              <dt className="text-muted">
                Also on the agent account (FullAccess recovery, unused)
              </dt>
              <dd className="font-mono break-all">{short(MAINNET.agentFullAccessKey, 14)}</dd>
            </div>
            <div>
              <dt className="text-muted">Funding wallet (Solana)</dt>
              <dd className="font-mono break-all">{short(MAINNET.fundingWallet)}</dd>
            </div>
          </dl>
        </article>

        <article className="min-w-0 rounded-xl border-2 border-accent/60 bg-surface p-5">
          <h3 className="font-display text-lg text-accent">What this does not prove</h3>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted">
            {MAINNET_LIMITS.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ol>
        </article>
      </div>

      <p className="text-center text-xs text-muted">
        <OutLink href={LINKS.mainnetEvidence}>Evidence bundle</OutLink> ·{" "}
        <OutLink href={LINKS.mainnetOutcomeEvidence}>Outcome readback</OutLink> ·{" "}
        <OutLink href={LINKS.mainnetObservation}>Raw public RPC observation</OutLink> ·{" "}
        <OutLink href={LINKS.mainnetObserverRun}>Observer run</OutLink> · Reviewed{" "}
        {EVIDENCE_SNAPSHOT.dateLabel} against{" "}
        <OutLink href={LINKS.reviewedSource}>X3Lang {EVIDENCE_SNAPSHOT.commit.slice(0, 7)}</OutLink>
      </p>
    </div>
  );
}
