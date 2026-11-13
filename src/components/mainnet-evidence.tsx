import { OutLink, Tag } from "@/components/code-block";
import { EVIDENCE_SNAPSHOT, LINKS, MAINNET } from "@/lib/front-door";

/** The same reviewed evidence is shown in the proof page and Judge Console. */
export function MainnetEvidence() {
  const steps = [
    {
      label: "1 · Guard accepted · NEAR mainnet",
      value: `${MAINNET.guardChecks} / ${MAINNET.guardChecks} checks passed`,
      detail: "The restricted agent key accepted the official signed live quote after owner approval. Guard checked the mandate, amount, recipient, refund address and deadline.",
      tx: MAINNET.guardTx,
      href: LINKS.mainnetGuardTx,
    },
    {
      label: "2 · Deposited · Solana mainnet",
      value: `${MAINNET.amountIn} USDC`,
      detail: "The funding wallet transferred USDC to the deposit address from the accepted quote. Its controller has not been established by the published evidence.",
      tx: MAINNET.depositTx,
      href: LINKS.mainnetDepositTx,
    },
    {
      label: "3 · Delivered · NEAR mainnet",
      value: `${MAINNET.amountOut} USDC`,
      detail: "Finalized payout logs record the native USDC transfer to x3lang.near. Provider status associates this payout with the Solana deposit.",
      tx: MAINNET.payoutTx,
      href: LINKS.mainnetPayoutTx,
    },
  ];

  return (
    <div className="space-y-6" data-mainnet-evidence>
      <div className="flex flex-wrap justify-center gap-2">
        <Tag>Mainnet · Solana → NEAR</Tag>
        <Tag>Official signed 1Click quote</Tag>
        <Tag>Historical completed trade</Tag>
      </div>
      <p className="mx-auto max-w-3xl text-center text-lg text-fg">
        A restricted agent key accepted the quote. A funding wallet deposited 25 USDC on Solana.
        24.9952 USDC reached <span className="font-mono">{MAINNET.owner}</span> on NEAR.
      </p>
      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map((step) => (
          <article key={step.label} className="min-w-0 rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-semibold text-muted">{step.label}</h3>
            <p className="mt-3 font-display text-2xl text-primary">{step.value}</p>
            <p className="mt-3 text-sm text-muted">{step.detail}</p>
            <p className="mt-4 break-all font-mono text-xs">
              <OutLink href={step.href}>{step.tx}</OutLink>
            </p>
          </article>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="min-w-0 rounded-xl border border-border bg-surface p-5">
          <h3 className="font-display text-xl text-fg">Check the original records</h3>
          <p className="mt-3 text-sm text-muted">
            The public RPC observation from {MAINNET.observedAt} reports 18 passed, 0 failed
            and 1 not checked: who controls the funding wallet. The archived signed quote and
            evidence checksum can be verified independently.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><OutLink href={LINKS.mainnetEvidence}>Evidence bundle and full limits</OutLink></li>
            <li><OutLink href={LINKS.mainnetObservation}>Raw public RPC observation</OutLink></li>
            <li><OutLink href={LINKS.mainnetChecksums}>SHA-256 checksum</OutLink></li>
            <li><OutLink href={LINKS.mainnetObserverRun}>Public observer run</OutLink></li>
          </ul>
        </article>
        <article className="min-w-0 rounded-xl border border-border bg-surface p-5">
          <h3 className="font-display text-xl text-fg">What remains unproved</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>Guard did not custody or transfer the USDC; the funding key can bypass it.</li>
            <li>The two stored program hashes are not yet matched to committed .x3 source files.</li>
            <li>The provider status link between chains is not cryptographic atomic settlement.</li>
            <li>Guard had no recorded outcome at observation. This is one small demonstration.</li>
          </ul>
        </article>
      </div>
      <p className="text-center text-xs text-muted">
        Source reviewed {EVIDENCE_SNAPSHOT.dateLabel} · <OutLink href={LINKS.reviewedSource}>
          X3Lang {EVIDENCE_SNAPSHOT.commit.slice(0, 7)}
        </OutLink> · <OutLink href={LINKS.mainnetApprovalTx}>Owner approval</OutLink>
      </p>
    </div>
  );
}
