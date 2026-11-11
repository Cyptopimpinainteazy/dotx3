import { createFileRoute } from "@tanstack/react-router";
import { ActionLink, Card, CardGrid, Section, SiteShell } from "@/components/site-shell";
import { OutLink } from "@/components/code-block";
import { nearTracks } from "@/lib/near-tracks";
import { LINKS } from "@/lib/front-door";

export const Route = createFileRoute("/near")({ component: NearPage });
function NearPage() {
  return (
    <SiteShell
      eyebrow="NEAR competition · 2026"
      title="One policy. Three track perspectives."
      lede="X3 Shield connects owner-defined rules, agent payment requests, and cross-chain quote checks. Explore each track with its own demonstration, source and evidence limits."
    >
      <Section
        title="Choose a track"
        intro="These pages explain project fit and published evidence. They do not certify submission or judging status."
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
      <Section title="Follow the evidence" alt>
        <CardGrid>
          <Card title="Local checks">
            Run the browser playground to edit policy and inspect a deterministic verdict. It does
            not sign or move funds.
          </Card>
          <Card title="NEAR Guard">
            Inspect historical testnet transactions and archived view results. A signed quote and a
            policy decision establish different facts.
          </Card>
          <Card title="Delivered funds">
            Inspect both finalized testnet chain records and the relay trust assumptions. Quote
            acceptance alone is insufficient.
          </Card>
        </CardGrid>
        <p className="mt-8 text-center">
          <OutLink href={LINKS.hackathonDocs}>Source evidence and judge walkthroughs</OutLink>
        </p>
      </Section>
    </SiteShell>
  );
}
