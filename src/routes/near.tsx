import { createFileRoute } from "@tanstack/react-router";
import { ActionLink, Card, CardGrid, Section, SiteShell } from "@/components/site-shell";
import { OutLink } from "@/components/code-block";
import { nearTracks } from "@/lib/near-tracks";
import { EVIDENCE_SNAPSHOT, LINKS } from "@/lib/front-door";

export const Route = createFileRoute("/near")({ component: NearPage });
function NearPage() {
  return (
    <SiteShell
      eyebrow="NEAR competition · 2026"
      title="One policy. Three track perspectives."
      lede="A restricted agent call on NEAR, 21 passing policy and quote checks, and a funded Solana-to-NEAR mainnet swap. Explore what each result establishes for the three tracks."
    >
      <Section
        title="Choose a track"
        intro={`Evidence reviewed ${EVIDENCE_SNAPSHOT.dateLabel}. The repository's submission checklist names Security and Agents; DeFi remains a proposed perspective. These pages do not certify organizer acceptance or a submitted third track.`}
      >
        <CardGrid>
          {nearTracks.map((track) => (
            <Card key={track.slug} title={track.title}>
              <p>{track.question}</p>
              <p className="mt-4">{track.detail}</p>
              <div className="mt-6">
                <ActionLink
                  to={
                    track.slug === "security"
                      ? "/security"
                      : track.slug === "agents"
                        ? "/agents"
                        : "/defi"
                  }
                >
                  Explore track
                </ActionLink>
              </div>
            </Card>
          ))}
        </CardGrid>
      </Section>
      <div className="mx-auto max-w-6xl px-5 text-center">
        <ActionLink to="/labs">Open the learning labs</ActionLink>
      </div>
      <Section title="The new mainnet evidence">
        <p className="mx-auto max-w-3xl text-muted">
          For invoice_06, x3-agent.x3lang.near used its restricted FunctionCall key to accept a
          signed live quote on x3lang.near. The Solana deposit was 25.000000 USDC; the NEAR payout
          was 24.995200 USDC. Guard authorization, funding and delivery have separate records.
          The original .x3 files match the hashes Guard stores, the owner signed the deposit from
          the wallet named in the mandate, and the agent recorded a Settled outcome on Guard.
        </p>
        <p className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-3">
          <OutLink href={LINKS.mainnetEvidence}>Evidence and limits</OutLink>
          <OutLink href={LINKS.mainnetGuardTx}>Agent authorization</OutLink>
          <OutLink href={LINKS.mainnetDepositTx}>Solana deposit</OutLink>
          <OutLink href={LINKS.mainnetPayoutTx}>NEAR payout</OutLink>
        </p>
      </Section>
      <Section title="Follow the evidence" alt>
        <CardGrid>
          <Card title="Local checks">
            Run the browser playground to edit policy and inspect a deterministic verdict. It does
            not sign or move funds.
          </Card>
          <Card title="NEAR Guard">
            Inspect the mainnet agent authorization and the historical testnet refusal. Guard
            authorizes the deposit address; it does not hold the funds.
          </Card>
          <Card title="Delivered funds">
            Open the finalized mainnet deposit and payout, then read how 1Click status associates
            them. Keep the older Tidepool testnet transfer and its trust assumptions separate.
          </Card>
        </CardGrid>
        <p className="mt-8 text-center">
          <OutLink href={LINKS.hackathonDocs}>Source evidence and judge walkthroughs</OutLink>
        </p>
      </Section>
      <Section title="What moves the proof meter next">
        <ol className="mx-auto max-w-3xl list-decimal space-y-4 pl-6 text-muted">
          <li>Publish an allowed scoped-vault testnet payment and the cap, recipient, daily-window and refund refusal records.</li>
          <li>Land and verify program-hash enforcement, including rejection of a mismatched program.</li>
          <li>Complete the hostile-model mainnet demonstration, independent review and release provenance gates.</li>
        </ol>
        <p className="mt-6 text-center">
          <ActionLink to="/proof">Inspect the evidence behind the meter</ActionLink>
        </p>
      </Section>
    </SiteShell>
  );
}
