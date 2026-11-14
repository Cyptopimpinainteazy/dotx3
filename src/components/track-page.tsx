import { ActionLink, Card, CardGrid, Section, SiteShell } from "@/components/site-shell";
import { CodeBlock, OutLink } from "@/components/code-block";
import { EVIDENCE_SNAPSHOT, LINKS, RAW, MANDATE, TRADE } from "@/lib/front-door";
import { nearTracks } from "@/lib/near-tracks";

export function TrackPage({ slug }: { slug: (typeof nearTracks)[number]["slug"] }) {
  const track = nearTracks.find((item) => item.slug === slug)!;
  return (
    <SiteShell
      eyebrow="NEAR competition"
      title={track.title}
      lede={track.question}
      actions={
        <>
          <ActionLink to={track.demo}>Run or inspect the demonstration</ActionLink>
          <ActionLink to="/near" outline>
            All four tracks
          </ActionLink>
        </>
      }
    >
      <Section title="How .x3 fits">
        <p className="mx-auto max-w-3xl text-lg text-muted">{track.detail}</p>
        <CodeBlock
          title={
            slug === "defi" ? "The historical transfer program" : "The owner's spending mandate"
          }
          code={slug === "defi" ? TRADE : MANDATE}
        />
        <p className="mt-4 text-muted">
          Amounts use token base units. These accounts are example or historical testnet identities;
          use the source guide before adapting a program.
        </p>
      </Section>
      <Section title="What the evidence establishes" alt>
        <CardGrid>
          <Card title="Published result">{track.evidence}</Card>
          <Card title="Trust and limits">{track.limit}</Card>
          <Card title="Reproduce and inspect">
            <OutLink href={track.evidenceHref}>Current mainnet evidence and limits</OutLink>
            <p className="mt-4">
            <OutLink href={`${RAW}/docs/hackathon/${track.source}`}>
              Track source and historical demonstrations
            </OutLink>
            </p>
            <p className="mt-4">
              <OutLink href={LINKS.guardEvidence}>Archived Guard calls</OutLink>
            </p>
          </Card>
        </CardGrid>
        <p className="mx-auto mt-6 max-w-3xl text-muted">
          <span className="font-semibold text-fg">Next evidence: </span>{track.next}
        </p>
        <p className="mt-3 text-center text-xs text-muted">Reviewed {EVIDENCE_SNAPSHOT.dateLabel} against X3Lang {EVIDENCE_SNAPSHOT.commit.slice(0, 7)}.</p>
      </Section>
      <div className="mx-auto max-w-6xl px-5 text-center">
        <ActionLink to="/labs" outline>
          Practice in the learning labs
        </ActionLink>
      </div>
      <Section title="Judge walkthrough">
        <ol className="mx-auto max-w-3xl list-decimal space-y-4 pl-6 text-muted">
          <li>
            Read the mandate and payment source. Identify recipient, asset, amount, nonce, deadline
            and refund terms.
          </li>
          <li>
            Run the local policy preview. Change the recipient to attacker.near and inspect the
            refusal; local results do not prove chain execution.
          </li>
          <li>
            Open the mainnet invoice_06 bundle and the separately labeled testnet records. Match
            each contract, transaction and network to its claim. Check that the two published .x3
            files hash to the values Guard stores for invoice_06.
          </li>
          <li>
            For delivery, inspect the source and destination finalized records and the relay
            assumptions separately from Guard authorization.
          </li>
        </ol>
        <p className="mt-8 text-center">
          <OutLink href={`${RAW}/docs/hackathon/JUDGE_GUIDE.md`}>Full judge guide</OutLink>
        </p>
      </Section>
    </SiteShell>
  );
}
