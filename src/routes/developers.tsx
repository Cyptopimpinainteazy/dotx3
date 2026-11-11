import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock, OutLink, Tag } from "@/components/code-block";
import { Section, SiteShell } from "@/components/site-shell";
import { LINKS, SITE } from "@/lib/front-door";

export const Route = createFileRoute("/developers")({ component: DevelopersPage });

function DevelopersPage() {
  return (
    <SiteShell
      eyebrow="View the Code"
      title="Get the website and language tools."
      lede="dotx3 contains this website. X3Lang contains the language tools, contracts and execution evidence. Install from a reviewed source revision and retain its commit with your results."
    >
      <div className="mx-auto max-w-6xl px-5 pt-8">
        <a
          href="/bootcamp"
          className="tap inline-flex min-h-11 items-center rounded-lg border border-border px-5 text-primary"
        >
          Enter Bootcamp — the in-depth .x3 developer course →
        </a>
      </div>
      <Section title="Repository">
        <div className="grid gap-3 sm:grid-cols-2">
          <p>
            <OutLink href="https://github.com/Cyptopimpinainteazy/dotx3">
              dotx3 website source
            </OutLink>
          </p>
          <p>
            <OutLink href={LINKS.repo}>X3Lang compiler / X3 Shield source</OutLink>
          </p>
          <p>
            <OutLink href={LINKS.readme}>README and getting started</OutLink>
          </p>
          <p>
            <OutLink href={LINKS.actions}>CI results</OutLink>
          </p>
          <p>
            <OutLink href={LINKS.issues}>Bugs and feature requests</OutLink>
          </p>
          <p>
            <OutLink href={LINKS.pulls}>Pull requests</OutLink>
          </p>
          <p>
            <OutLink href={LINKS.license}>MIT license</OutLink>
          </p>
          <p>
            <OutLink href={LINKS.contributing}>Contributing</OutLink>
          </p>
          <p>
            <OutLink href={LINKS.baseline}>Hackathon diff, baseline...master</OutLink>
          </p>
        </div>
        <p className="mt-6 text-sm text-muted">
          dotx3 hosts the website and browser tools. X3Lang hosts the compiler, contracts and
          evidence. The separate X3 chain runtime is outside the NEAR judge path; use the source and
          network named by each demonstration.
        </p>
      </Section>

      <Section title="Install from source" alt>
        <CodeBlock
          title="Python intent tools"
          code={`git clone https://github.com/Cyptopimpinainteazy/x3lang.git
cd x3lang
python3 -m venv .venv && . .venv/bin/activate
pip install -r x3-lang/requirements.txt pytest
python3 x3-lang/cli.py x3-lang/examples/arb_solana_eth.x3`}
        />
        <CodeBlock
          title="Rust surface, workspace only"
          code={`cargo test --manifest-path x3-lang/Cargo.toml
cargo run --manifest-path x3-lang/Cargo.toml -p x3-tools --bin x3c -- parse x3-lang/examples/trading_core_v1.x3`}
        />
        <p className="mt-4 text-sm text-muted">
          Releases page:{" "}
          <OutLink href={`${LINKS.repo}/releases`}>
            github.com/Cyptopimpinainteazy/x3lang/releases
          </OutLink>
          . This guide installs from source. Inspect release artifacts and their provenance
          separately before choosing a version.
        </p>
      </Section>

      <Section title="1Click integration">
        <p className="text-muted">
          Same four calls a person or an agent uses. Docs:{" "}
          <OutLink href={LINKS.intentsDocs}>NEAR Intents 1Click quickstart</OutLink>. The adapter
          verifies the quote signature before it reads terms. A live quote requests a deposit
          address; a separate wallet funding step can spend real funds. The adapter’s official
          1Click route is distinct from the historical Tidepool community testnet.
        </p>
        <CodeBlock title="Tokens" code="curl https://1click.chaindefuser.com/v0/tokens" />
        <CodeBlock
          title="Dry quote"
          code={`curl -X POST https://1click.chaindefuser.com/v0/quote \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT" \\
  -d '{
    "dry": true,
    "swapType": "EXACT_INPUT",
    "slippageTolerance": 100,
    "originAsset": "nep141:wrap.near",
    "depositType": "ORIGIN_CHAIN",
    "destinationAsset": "nep141:arb-0x912ce59144191c1204e64559fe8253a0e49e6548.omft.near",
    "amount": "1000000000000000000000000",
    "recipient": "0xYourAddress",
    "recipientType": "DESTINATION_CHAIN",
    "refundTo": "your.near",
    "refundType": "ORIGIN_CHAIN"
  }'`}
        />
        <CodeBlock
          title="Status"
          code='curl "https://1click.chaindefuser.com/v0/status?depositAddress=THE_DEPOSIT_ADDRESS"'
        />
        <p className="mt-4 text-sm text-muted">
          Repo commands, not this website:{" "}
          <span className="text-fg">python3 x3-lang/near_intents.py quote FILE.x3</span> for a dry
          quote. <span className="text-fg">--live</span> asks for a deposit address. The tool does
          not sign the deposit.
        </p>
      </Section>

      <Section title="Doors that are not up yet" alt>
        <p className="text-muted">
          {SITE} ships the four working doors (demo, docs, code, proof) plus /playground, /language
          and /back. These proposed routes are named so they are not pretended:
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-muted md:grid-cols-2">
          <li>/about — the language overview is /language</li>
          <li>/shield — mandate and Guard limits are on the demo and proof pages</li>
          <li>/hackathon — one demo covers security, agents, and DeFi</li>
          <li>/security — reporting steps are in the repo SECURITY.md</li>
          <li>/ecosystem — x3star.net names are not verified live apps</li>
        </ul>
        <div className="mt-8 grid gap-3 text-sm">
          <p>
            <Tag>Missing</Tag>
          </p>
          <p className="text-muted">
            Demo video permalink. Public X demo-post permalink. Judge runbook tied to one current
            commit, beyond the README steps. Release artifact with checksum. Privacy and terms,
            because this site does not collect accounts or connect a wallet.
          </p>
          <p className="text-muted">
            Community, unverified as to whether each post is current:{" "}
            <OutLink href={LINKS.x}>@x3starchain</OutLink>
            {" · "}
            <OutLink href={LINKS.telegram}>t.me/x3starchain</OutLink>
            {" · "}
            <OutLink href={LINKS.hackathon}>nearhackathon.com</OutLink>
            {" · "}
            <OutLink href={LINKS.nearDocs}>docs.near.org</OutLink>
          </p>
          <p className="text-muted">
            A static browser demo is published separately at{" "}
            <OutLink href={LINKS.browserDemo}>x3-guard.pages.dev</OutLink>. The hackathon still
            needs its own demo-post URL. This site does not replace that post.
          </p>
        </div>
      </Section>
    </SiteShell>
  );
}
