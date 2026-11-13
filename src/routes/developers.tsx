import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock, OutLink, Tag } from "@/components/code-block";
import { Section, SiteShell } from "@/components/site-shell";
import { EVIDENCE_SNAPSHOT, LINKS, SITE } from "@/lib/front-door";

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
            <OutLink href={LINKS.repo}>X3Lang compiler / X3 Force Field source</OutLink>
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

      <Section title="Current evidence snapshot" alt>
        <p className="text-muted">
          Reviewed {EVIDENCE_SNAPSHOT.dateLabel}: mainnet invoice_06 records a restricted NEAR
          agent authorization, 25 USDC deposited on Solana and 24.9952 USDC delivered to
          x3lang.near. The committed RPC observation, checksum and exact-revision CI are linked
          below. Funding-wallet ownership, matching .x3 source files and guarded custody remain
          separate unfinished work.
        </p>
        <p className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
          <OutLink href={LINKS.mainnetEvidence}>Mainnet archive</OutLink>
          <OutLink href={LINKS.mainnetObservation}>RPC observations</OutLink>
          <OutLink href={LINKS.mainnetChecksums}>SHA256SUMS</OutLink>
          <OutLink href={LINKS.currentCi}>Reviewed revision CI</OutLink>
        </p>
        <p className="mt-5 break-all font-mono text-sm text-muted">
          X3Lang source: {EVIDENCE_SNAPSHOT.commit}
        </p>
      </Section>

      <Section title="Install from source" alt>
        <CodeBlock
          title="Python intent tools"
          code={`git clone https://github.com/Cyptopimpinainteazy/x3lang.git
cd x3lang
git checkout ${EVIDENCE_SNAPSHOT.commit}
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

      <Section title="Recheck the mainnet record">
        <CodeBlock
          title="Read-only public RPC observer, from the pinned X3Lang checkout"
          code={`python3 scripts/hackathon/observe_mainnet_invoice06.py --out /tmp/x3-invoice06-observation.json`}
        />
        <p className="mt-4 text-sm text-muted">
          This observer uses public RPC, signs nothing and sends no funds. The archived run
          reported 18 checks passed, zero failed and one fact unreadable on chain. Fresh balances,
          key allowances and final blocks may differ. The 1Click status record associates the
          chains; the observer does not prove cryptographic cross-chain causality.
        </p>
      </Section>

      <Section title="Choose the NEAR integration level">
        <p className="text-muted">
          1Click handles the higher-level swap workflow. The separate{" "}
          <OutLink href="https://docs.near-intents.org/integration/devkit/intents-sdk">
            Intents SDK
          </OutLink>{" "}
          exposes lower-level intent execution and withdrawals. Official NEAR Intents has no testnet
          version; our historical Tidepool testnet delivery is a separate trusted-relay experiment.
          X3 Force Field is also separate from{" "}
          <OutLink href="https://docs.near-intents.org/security-compliance/proactive-intents-security">
            official NEAR SHIELD
          </OutLink>
          .
        </p>
        <p className="mt-4 text-sm text-muted">
          An explorer helps inspect records; an API key enables provider access. Neither establishes
          a funded swap or destination settlement. Keep distribution-channel credentials on the
          server.
        </p>
      </Section>
      <Section title="1Click integration">
        <p className="text-muted">
          These server-side examples cover tokens, a dry quote and a status query. Docs:{" "}
          <OutLink href="https://docs.near-intents.org/integration/distribution-channels/1click-api/quickstart/making-a-request">
            NEAR Intents 1Click quickstart
          </OutLink>. The adapter
          verifies the quote signature before it reads terms. A live quote requests a deposit
          address; a separate wallet funding step can spend real funds. The adapter’s official
          1Click route is distinct from the historical Tidepool community testnet.
        </p>
        <p className="mt-4 text-sm text-muted">
          Use a 1Click partner credential in the server-only NEAR_INTENTS_API_KEY environment
          variable and send it through X-API-Key. Authorization: Bearer is also accepted for that
          partner credential on ordinary 1Click calls. Aurora, Explorer, user-session and SHIELD
          credentials have separate roles; do not assume they are interchangeable. Never put a
          partner key in browser code or a public environment variable.{" "}
          <OutLink href="https://docs.near-intents.org/integration/distribution-channels/1click-api/authentication">
            Official authentication guide
          </OutLink>.
        </p>
        <CodeBlock
          title="Tokens (server-side)"
          code={`curl https://1click.chaindefuser.com/v0/tokens \\
  -H "X-API-Key: $NEAR_INTENTS_API_KEY"`}
        />
        <CodeBlock
          title="Dry quote template (server-side; replace placeholders)"
          code={`curl -X POST https://1click.chaindefuser.com/v0/quote \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: $NEAR_INTENTS_API_KEY" \\
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
    "refundType": "ORIGIN_CHAIN",
    "deadline": "REPLACE_WITH_FUTURE_ISO_8601_UTC_TIMESTAMP"
  }'`}
        />
        <p className="mt-4 text-sm text-muted">
          Replace the recipient, refund address and deadline before using the template. The
          deadline must be a future ISO 8601 UTC timestamp that allows time for origin-chain
          confirmation. Confirm asset identifiers against the current token list. Keep dry set
          to true for a preview; it does not return a deposit address.
        </p>
        <CodeBlock
          title="Status (server-side JavaScript; existing quote only)"
          code={`// quote is the quote field from an existing saved response.
const apiKey = process.env.NEAR_INTENTS_API_KEY;
if (!apiKey) throw new Error("Missing server-side 1Click partner key");
if (!quote.depositAddress) throw new Error("This quote has no deposit address");
const query = new URLSearchParams({ depositAddress: quote.depositAddress });
if (quote.depositMemo != null) query.set("depositMemo", quote.depositMemo);
const response = await fetch(
  "https://1click.chaindefuser.com/v0/status?" + query.toString(),
  { headers: { "X-API-Key": apiKey }, redirect: "error" },
);
if (!response.ok) throw new Error("1Click status unavailable: " + response.status);
const status = await response.json();`}
        />
        <p className="mt-4 text-sm text-muted">
          URLSearchParams encodes the address and the exact quote.depositMemo when supplied.
          A status response is provider-reported execution state; it does not independently
          prove a destination transfer or finality.
        </p>
        <p className="mt-4 text-sm text-muted">
          For supported one-time swaps, a live quote supplies quote.depositAddress. Reusable
          addresses use a separate ANY_INPUT workflow and quote.chainDepositAddresses, with both
          a partner API key and the owning user&apos;s session. The current X3Lang and dotx3 clients
          do not implement reusable-address creation.{" "}
          <OutLink href="https://docs.near-intents.org/integration/distribution-channels/1click-api/reusable-deposit-addresses">
            Official reusable-address guide
          </OutLink>.
        </p>
        <p className="mt-4 text-sm text-muted">
          Repo commands, not this website:{" "}
          <span className="text-fg">python3 x3-lang/near_intents.py quote FILE.x3</span> for a dry
          quote. <span className="text-fg">--live</span> asks for a deposit address. The tool does
          not sign the deposit.
        </p>
      </Section>

      <Section title="Available resources and release review" alt>
        <p className="text-muted">
          {SITE} includes language guides, browser tools, track pages and published evidence.
          These resources are available in the current site:
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-muted md:grid-cols-2">
          <li><a className="text-primary underline" href="/security">Security track</a> — policy checks and Guard limits</li>
          <li><a className="text-primary underline" href="/media/x3-shield-who-gets-paid.mp4">Who gets paid? video</a> — an explainer with local, testnet and dramatized scenes</li>
          <li><a className="text-primary underline" href="/labs">Labs</a> — compiler, signed-quote demo, judge cases and attack lab</li>
          <li><a className="text-primary underline" href="/near">NEAR hub</a> — Security, Agents and DeFi perspectives</li>
        </ul>
        <div className="mt-8 grid gap-3 text-sm">
          <p>
            <Tag>Review by revision</Tag>
          </p>
          <p className="text-muted">
            Read the{" "}
            <OutLink href={`${LINKS.repo}/blob/${EVIDENCE_SNAPSHOT.commit}/docs/hackathon/JUDGE_GUIDE.md`}>
              judge guide at the reviewed source revision
            </OutLink>{" "}
            and the repo&apos;s <OutLink href={LINKS.security}>private vulnerability reporting steps</OutLink>.
            The explainer video is not settlement evidence or a confirmed hackathon submission.
            Check release artifacts, checksums and submission links against the revision you intend
            to use.
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
            <OutLink href={LINKS.browserDemo}>x3-guard.pages.dev</OutLink>. Public demos and videos
            do not establish the status of a hackathon submission.
          </p>
        </div>
      </Section>
    </SiteShell>
  );
}
