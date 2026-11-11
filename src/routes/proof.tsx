import { createFileRoute } from "@tanstack/react-router";
import { OutLink, Tag } from "@/components/code-block";
import { Section, SiteShell } from "@/components/site-shell";
import { LINKS, PROGRAM_SHA } from "@/lib/front-door";

export const Route = createFileRoute("/proof")({ component: ProofPage });

function Row({
  label,
  detail,
  href,
  hrefLabel,
}: {
  label: string;
  detail: string;
  href: string;
  hrefLabel: string;
}) {
  return (
    <article className="rounded-xl border border-border bg-surface p-5">
      <h3 className="font-display text-lg text-fg">{label}</h3>
      <p className="mt-2 text-muted">{detail}</p>
      <p className="mt-3">
        <OutLink href={href}>{hrefLabel}</OutLink>
      </p>
    </article>
  );
}

function ProofPage() {
  return (
    <SiteShell
      eyebrow="Inspect the Proof"
      title="Testnet and local. Not mainnet."
      lede="Each row says which network it is. A signed 1Click quote is not a settlement. A Guard acceptance is not a transfer."
    >
      <Section title="CI and local gates">
        <div className="grid gap-4 md:grid-cols-2">
          <Row
            label="GitHub Actions"
            detail="Workflows are public, including the judge gate, the won't-compile check, and the two-chain evidence replay. Open a run and read that run. This page does not paste a green check from memory."
            href={LINKS.actions}
            hrefLabel="X3Lang Actions"
          />
          <Row
            label="Recorded local result"
            detail="README: at commit c5a4e39, pytest printed 594 passed, 1 skipped, and the Guard crate printed 62 passed. Re-run before you cite either number against a newer commit."
            href={LINKS.readme}
            hrefLabel="README walkthrough"
          />
        </div>
      </Section>

      <Section title="Quote verification" alt>
        <div className="mb-4">
          <Tag>NEAR testnet · official 1Click quote · not a deposit</Tag>
        </div>
        <div className="grid gap-4">
          <Row
            label="Dry quote refused"
            detail="Guard verified the official 1Click dry-quote signature, then refused it. Archived checks include a recipient mismatch and the dry-quote failures. Contract x3lang-guard-20261106.testnet."
            href={LINKS.dryQuoteTx}
            hrefLabel="Refusal 3Q7qTZqiRBB6EuhN78Ra5Q5NBqPXDhfuCg2FKW8WoU2q"
          />
          <Row
            label="Live quote accepted, then stopped"
            detail="An official 1Click live quote that matched the policy was accepted. The README says this stopped before any deposit. A valid signature authenticates provider terms, not a completed swap."
            href={LINKS.liveQuoteTx}
            hrefLabel="Acceptance 6B6k5kre4mFoBq7RuJNadQgrhEvmgb9WDLepX22CxzUZ"
          />
          <Row
            label="Guard deploy for that quote contract"
            detail="Deployment transaction for x3lang-guard-20261106.testnet. Wasm SHA-256 prefix recorded in the README as ac44fa53…f8ab."
            href={LINKS.deployTx}
            hrefLabel="Deploy FJ5voQaArx17QV4TzDLYDq93cuoAVLSRxjcxbswuyE8v"
          />
        </div>
      </Section>

      <Section title="Refusal and acceptance">
        <div className="mb-4">
          <Tag>NEAR testnet · x3lang.testnet · no funds in the contract</Tag>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Row
            label="Refused: attacker.near"
            detail="agent_register_intent failed mandate_recipient. Other guards on that intent passed. The explorer receipt can show only a generic Wasm trap; the reason is in the archived view."
            href={LINKS.refuseTx}
            hrefLabel="AhVBD7oXfwsixBipupjCzuhNdqunjdXJnLz3LXnmfnN8"
          />
          <Row
            label="Accepted: permitted recipient"
            detail="Same mandate, recipient x3lang.testnet, intent_registered. The mandate was later observed revoked. Create and revoke themselves are state observations, not separately anchored transactions in that note."
            href={LINKS.acceptTx}
            hrefLabel="DPJfcRUGk56h8sSsFsDFFgUMQAiyBCtpMuvquF9FvTct"
          />
        </div>
        <p className="mt-4 text-sm text-muted">
          Write-up: <OutLink href={LINKS.guardEvidence}>near-guard-testnet-live-2026-11-06.md</OutLink>
        </p>
      </Section>

      <Section title="Settlement" alt>
        <div className="mb-4 flex flex-wrap gap-2">
          <Tag>Historical</Tag>
          <Tag>Base Sepolia to NEAR testnet</Tag>
          <Tag>Tidepool relay · not official 1Click settlement</Tag>
        </div>
        <p className="max-w-3xl text-muted">
          1.000000 test USDC left Base Sepolia. 0.997400 arrived on NEAR testnet for x3lang.testnet, above min_receive 980000. Program SHA-256 {PROGRAM_SHA} was bound on x3guardlaunch2026.testnet in block 276,595,201 before the source transfer. The README says this used a trusted testnet relay. It does not prove atomic settlement, and it is not mainnet.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Row
            label="Source · Base Sepolia"
            detail="Finality was checked against two public RPCs in the repo's verifier. Label this historical testnet source, not a mainnet USDC payment."
            href={LINKS.baseTx}
            hrefLabel="0x46c21dc305a9271c4e74c6d0734fb50f847a1e53d3cad87976133d66fd6728d9"
          />
          <Row
            label="Destination · NEAR testnet"
            detail="Payout to x3lang.testnet. Independently verified mainnet settlement: none published."
            href={LINKS.nearPayout}
            hrefLabel="EBEBxJNgV9U5tBFBLj18ZzukgArqwXH5rBsBStFyCm1d"
          />
        </div>
      </Section>

      <Section title="Not claimed">
        <ul className="mx-auto max-w-3xl list-disc space-y-2 pl-5 text-muted">
          <li>No mainnet deployment and no funded official 1Click settlement.</li>
          <li>No public audited vault. Guard does not custody tokens. An unrestricted origin key can bypass it.</li>
          <li>No cryptographic atomic cross-chain causality for the Tidepool trade.</li>
          <li>No downloadable release artifact with a checksum. The commit is the artifact until a release exists.</li>
          <li>
            Report vulnerabilities in private. Do not file exploits, keys, or seeds in a public issue. <OutLink href={LINKS.security}>SECURITY.md</OutLink>
          </li>
        </ul>
      </Section>
    </SiteShell>
  );
}
