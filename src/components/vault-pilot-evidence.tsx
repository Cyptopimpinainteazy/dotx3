import { OutLink, Tag } from "@/components/code-block";
import {
  VAULT_PILOT as pilot,
  VAULT_PILOT_LIMITS,
  VAULT_PILOT_LINKS as links,
} from "@/lib/vault-pilot";

/** An archived completed payment, with source custody and quote approval labeled explicitly. */
export function VaultPilotEvidence() {
  const steps = [
    {
      title: "Owner approved the quote",
      network: "Solana mainnet",
      value: "Exactly 5 USDC",
      detail:
        "Nonce 1 binds the amount, deposit account, quote digest and expiry. The owner signs this approval.",
      href: links.approval,
      label: "Inspect owner approval",
    },
    {
      title: "Agent executed from the vault",
      network: "Solana mainnet",
      value: "5.000000 USDC",
      detail:
        "The dedicated agent signs execution. The policy PDA authorizes the inner SPL token transfer from the vault.",
      href: links.source,
      label: "Inspect agent transfer",
    },
    {
      title: "USDC delivered on NEAR",
      network: "NEAR mainnet",
      value: "4.999746 USDC",
      detail:
        "The finalized token event pays x3lang.near, above the signed 4.974757-USDC minimum. Provider status: SUCCESS.",
      href: links.payout,
      label: "Inspect NEAR payout",
    },
  ];
  return (
    <div className="space-y-6" data-vault-pilot-evidence>
      <div className="flex flex-wrap justify-center gap-2">
        <Tag>Archived mainnet · {pilot.date}</Tag>
        <Tag>Owner-approved · agent-executed</Tag>
        <Tag>Settled · minimum met</Tag>
      </div>
      <p className="mx-auto max-w-3xl text-center text-lg text-fg">
        Your policy sets the budget. You approve the exact quote. The agent executes the allowed
        payment from a PDA-owned vault:{" "}
        <strong>5 USDC on Solana → 4.999746 USDC to x3lang.near</strong>.
      </p>
      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="flex min-w-0 flex-col rounded-xl border border-border bg-surface p-5"
          >
            <p className="text-xs font-semibold text-muted">{step.network}</p>
            <h3 className="mt-2 font-display text-xl text-fg">
              {index + 1}. {step.title}
            </h3>
            <p className="mt-3 font-display text-2xl text-primary">{step.value}</p>
            <p className="mt-3 text-sm text-muted">{step.detail}</p>
            <p className="mt-auto pt-4 text-sm">
              <OutLink href={step.href}>{step.label}</OutLink>
            </p>
          </li>
        ))}
      </ol>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-display text-lg text-fg">The policy after settlement</h3>
          <p className="mt-3 text-sm text-muted">
            5 USDC per payment and per rolling 24 hours. Nonce 1 consumed. No pending approval.
            Vault balance: 0 USDC. The archived post-state records one 5-USDC spend.
          </p>
          <p className="mt-3 text-sm">
            <OutLink href={links.summary}>Read the settlement and policy state</OutLink>
          </p>
        </article>
        <article className="rounded-xl border border-border bg-surface p-5">
          <h3 className="font-display text-lg text-fg">What a judge can try</h3>
          <p className="mt-3 text-sm text-muted">
            Edit a payment in the policy checker and inspect its decision locally. Then follow the
            real mainnet receipts here. These checks require no wallet connection or funds.
          </p>
          <p className="mt-3 text-sm">
            <a className="text-primary underline underline-offset-4" href="/playground">
              Try the policy checker
            </a>
          </p>
        </article>
      </div>
      <details className="rounded-xl border border-border bg-surface p-5">
        <summary className="cursor-pointer font-semibold text-fg">
          Proof boundaries and trust assumptions
        </summary>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
          {VAULT_PILOT_LIMITS.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">
          The generic receipt verifier rejects the differing request/program deadlines. The original
          receipt is preserved; the archive uses separate vault-commitment, source-event and direct
          payout checks.
        </p>
      </details>
      <p className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
        <OutLink href={links.proof}>Read the complete proof</OutLink>
        <OutLink href={links.verify}>View offline verifier</OutLink>
        <OutLink href={links.quote}>Inspect the signed quote</OutLink>
      </p>
      <p className="text-center text-xs text-muted">
        Historical evidence pinned to X3Lang {pilot.sourceCommit.slice(0, 7)}. This page does not
        request a quote, sign a transaction or spend funds.
      </p>
    </div>
  );
}
