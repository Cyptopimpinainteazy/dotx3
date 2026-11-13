import { ProviderIncidents } from '@/components/provider-incidents';
import { ExplorerEvidence } from '@/components/explorer-evidence';
import { MainnetEvidence } from '@/components/mainnet-evidence';
import { createFileRoute } from "@tanstack/react-router";
import { OutLink, Tag } from "@/components/code-block";
import { Section, SiteShell } from "@/components/site-shell";
import { EVIDENCE_SNAPSHOT, LINKS, PROGRAM_SHA } from "@/lib/front-door";

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
    <article className="min-w-0 rounded-xl border border-border bg-surface p-5">
      <h3 className="font-display text-lg text-fg">{label}</h3>
      <p className="mt-2 text-muted">{detail}</p>
      <p className="mt-3 [overflow-wrap:anywhere]">
        <OutLink href={href}>{hrefLabel}</OutLink>
      </p>
    </article>
  );
}

function ProofPage() {
  return (
    <SiteShell
      eyebrow="Inspect the Proof"
      title="Evidence by source and network."
      lede="The official Solana-to-NEAR mainnet settlement is now published. Follow the signed quote, Guard acceptance, source deposit and destination payout, then inspect the separate testnet and local evidence."
    >
      <div className="mx-auto max-w-6xl px-5"><ProviderIncidents /></div>

      <Section title="Mainnet settlement">
        <MainnetEvidence />
      </Section>

      <Section title="CI and local gates" alt>
        <div className="grid gap-4 md:grid-cols-2">
          <Row
            label="Seven passing checks at the reviewed commit"
            detail={`X3Lang ${EVIDENCE_SNAPSHOT.commit.slice(0, 7)}: Rust VM, provenance, Python/browser, compile-time refusals, signed-quote baselines, NEAR Guard and compromised-model refusal checks all passed. This result covers this revision only.`}
            href={LINKS.currentCi}
            hrefLabel="Inspect all checks for this commit"
          />
          <Row
            label="Reviewed source and reproducible walkthrough"
            detail={`Evidence reviewed ${EVIDENCE_SNAPSHOT.dateLabel}. The source revision is pinned so the README, contract and evidence can be inspected together. Local tests prove their tested behavior; they do not fill public-chain or independent-audit milestones.`}
            href={LINKS.reviewedSource}
            hrefLabel="Open the pinned X3Lang source"
          />
        </div>
      </Section>

      <Section title="Quote verification">
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
            detail="This earlier testnet run accepted an official 1Click live quote and stopped before a deposit. Its acceptance is separate from the completed mainnet invoice_06 trade above."
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

      <Section title="Refusal and acceptance" alt>
        <div className="mb-4">
          <Tag>NEAR testnet · x3lang.testnet · no swap-asset custody</Tag>
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

      <Section title="Settlement">
        <div className="mb-4 flex flex-wrap gap-2">
          <Tag>Historical</Tag>
          <Tag>Base Sepolia to NEAR testnet</Tag>
          <Tag>Tidepool relay · not official 1Click settlement</Tag>
        </div>
        <p className="max-w-3xl text-muted">
          1.000000 test USDC left Base Sepolia. 0.997400 arrived on NEAR testnet for x3lang.testnet, above min_receive 980000. Program SHA-256 <span className="break-all">{PROGRAM_SHA}</span> was bound on x3guardlaunch2026.testnet in block 276,595,201 before the source transfer. The README says this used a trusted testnet relay. It does not prove atomic settlement, and it is not mainnet.
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
            detail="Historical testnet payout to x3lang.testnet. These test assets and receipts are distinct from the mainnet USDC settlement above."
            href={LINKS.nearPayout}
            hrefLabel="EBEBxJNgV9U5tBFBLj18ZzukgArqwXH5rBsBStFyCm1d"
          />
        </div>
      </Section>

      <Section title="Mainnet Guard setup" alt>
        <p className="max-w-3xl text-muted">
          NEAR mainnet Guard deployment and setup are documented for x3lang.near. The archived
          records cover deployment, storage, scoped agent access, intent registration and owner
          approval. The later invoice_06 bundle above supplies the acceptance, deposit and payout
          records; the setup note remains a historical record.{" "}
          <OutLink href="https://github.com/Cyptopimpinainteazy/x3lang/blob/0a2c5f08694a206838cf01e774dc5dc843dc42b7/docs/hackathon/MAINNET_GUARD_DEPLOYMENT.md">
            Inspect the mainnet setup evidence
          </OutLink>.
        </p>
      </Section>

      <Section title="1Click Explorer history">
        <ExplorerEvidence />
      </Section>

      <Section title="Not claimed" alt>
        <ul className="mx-auto max-w-3xl list-disc space-y-2 pl-5 text-muted">
          <li>The mainnet payment and mandate hashes are not yet matched to committed .x3 source files. The controller of the Solana funding wallet remains unconfirmed.</li>
          <li>No public audited vault. Guard does not custody swap assets; native NEAR used for storage and account operation is separate. An unrestricted origin key can bypass it.</li>
          <li>No cryptographic atomic cross-chain causality for either the Tidepool testnet trade or the mainnet 1Click settlement.</li>
          <li>Exact approved-program enforcement is still in <OutLink href={LINKS.programBindingPr}>open PR #202</OutLink>. A stored hash does not prove that enforcement.</li>
          <li>No public scoped-vault refusal run, hostile-model mainnet run, independent audit or tagged release with build provenance is claimed by this snapshot.</li>
          <li>
            Report vulnerabilities in private. Do not file exploits, keys, or seeds in a public issue. <OutLink href={LINKS.security}>SECURITY.md</OutLink>
          </li>
        </ul>
      </Section>
    </SiteShell>
  );
}
