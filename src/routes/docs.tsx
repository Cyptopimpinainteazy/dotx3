import { Link, createFileRoute } from "@tanstack/react-router";
import { CodeBlock, OutLink, Tag } from "@/components/code-block";
import { Card, CardGrid, Section, SiteShell } from "@/components/site-shell";
import { EVIDENCE_SNAPSHOT, LINKS, MANDATE, TRADE } from "@/lib/front-door";
import { PRESETS } from "@/lib/x3/playground";

export const Route = createFileRoute("/docs")({ component: DocsPage });

function DocsPage() {
  return (
    <SiteShell
      eyebrow="Learn .x3"
      title="Write the rule. The agent does not get to waive it."
      lede="X3 is the owner's typed policy and the agent's payment program. A deterministic compiler and x3-guard on NEAR compare them. Model output never authorizes a deposit."
    >
      <div className="mx-auto flex max-w-6xl flex-wrap gap-3 px-5 pt-8">
        <Link
          to="/learn"
          className="tap inline-flex min-h-11 items-center rounded-lg bg-primary px-5 font-semibold text-bg hover:brightness-110"
        >
          New to .x3? Take the interactive tutorial →
        </Link>
        <a
          href="/bootcamp"
          className="tap inline-flex min-h-11 items-center rounded-lg border border-border px-5 text-primary"
        >
          Enter Bootcamp — the in-depth .x3 developer course →
        </a>
      </div>
      <Section
        title="What is dotx3?"
        intro="dotx3 is the public front door for the language, tools and evidence. A .x3 file is the program you write."
      >
        <CardGrid>
          <Card title="Owner mandate">
            Define the agent, spending asset, allowed recipients, payment and daily caps, approval
            threshold, refund address and expiry.
          </Card>
          <Card title="Payment intent">
            State what the agent wants to pay: source amount, destination asset and recipient,
            minimum output, mandate reference, nonce and deadline.
          </Card>
          <Card title="Check, then authorize">
            The frontend checks source. Guard checks signed quote terms on NEAR. A wallet funds
            separately, and settlement needs its own evidence.
          </Card>
        </CardGrid>
      </Section>
      <Section title="From policy to a recorded mainnet payment" alt>
        <p className="mx-auto max-w-3xl text-muted">
          The evidence reviewed {EVIDENCE_SNAPSHOT.dateLabel} includes a live 1Click quote accepted
          on x3lang.near by a restricted agent key, followed by a 25 USDC Solana deposit and
          24.9952 USDC delivery on NEAR. The original mandate and payment source files still need
          to be matched to their stored hashes. The examples below teach the language; they are
          not asserted to be the exact invoice_06 files.
        </p>
        <p className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-3">
          <OutLink href={LINKS.mainnetEvidence}>Mainnet evidence and limits</OutLink>
          <OutLink href={LINKS.mainnetObservation}>Public RPC observations</OutLink>
          <OutLink href={LINKS.mainnetChecksums}>Evidence checksum</OutLink>
        </p>
      </Section>
      <Section title="Quickstart">
        <p className="text-muted">
          Run these commands from a checkout of the X3Lang repository, not the dotx3 website. The
          local policy demo needs no wallet or API key and signs nothing. The bootcamp explains the
          language in depth.
        </p>
        <CodeBlock
          title="Install"
          code={`git clone https://github.com/Cyptopimpinainteazy/x3lang.git
cd x3lang
git checkout ${EVIDENCE_SNAPSHOT.commit}
python3 -m venv .venv && . .venv/bin/activate
pip install -r x3-lang/requirements.txt pytest`}
        />
        <CodeBlock
          title="Hash the trade program, then run the suite"
          code={`sha256sum x3-lang/examples/base_sepolia_to_near_testnet_1usdc.x3
python3 x3-lang/cli.py x3-lang/examples/arb_solana_eth.x3
PYTHONPATH=x3-lang python3 -m pytest x3-lang/tests -q`}
        />
        <p className="mt-4 text-sm text-muted">
          This checkout pins the reviewed evidence revision. Run its tests and retain the commit
          hash with the result. Contract checks are
          separate: cd x3-lang/near/x3-guard &amp;&amp; cargo test --locked. Historical test counts
          are not proof for your checkout.
        </p>
      </Section>

      <Section title="Syntax" alt>
        <CodeBlock title="Owner mandate" code={MANDATE} />
        <CodeBlock
          title="Agent payment under the owner mandate"
          code={PRESETS.find((preset) => preset.id === "authorized")!.intent}
        />
        <CodeBlock title="The program behind the testnet trade" code={TRADE} />
        <p className="mt-4 text-sm text-muted">
          <OutLink href={LINKS.mandate}>Mandate file</OutLink>
          {" · "}
          <OutLink href={LINKS.trade}>Trade file</OutLink>
          {" · "}
          <OutLink href={LINKS.examples}>All examples</OutLink>
        </p>
      </Section>

      <Section title="Read the amounts and limits">
        <CardGrid>
          <Card title="Integer token units">
            For six-decimal USDC, 25000000 means 25 USDC. Confirm the token registry and decimals
            before adapting examples. 100 bps means 1%.
          </Card>
          <Card title="Explicit permission">
            The example caps each payment at 50 USDC and a rolling day at 200 USDC. Above 30 USDC,
            an owner approval is required. Approval does not waive a cap.
          </Card>
          <Card title="A bounded request">
            Use a fresh nonce for each payment. Keep the origin refund address, minimum receipt and
            timeout explicit. Unsupported NEAR route shapes fail compilation.
          </Card>
        </CardGrid>
      </Section>
      <Section title="Compiler and execution">
        <CardGrid>
          <Card title="What compiles today">
            The Python frontend parses, type-checks, and checks mandates. Unsafe edits fail before a
            quote. Nine checked-in edits are refused at compile time, including a dropped nonce and
            a look-alike recipient.
          </Card>
          <Card title="What runs on NEAR">
            <span className="text-fg">x3-guard</span> stores the policy and rechecks quote terms. It
            does not custody swap assets; native NEAR used for storage and account operation is
            separate. Acceptance is not permission to send from an origin wallet.
          </Card>
          <Card title="What does not run on a block">
            The x3-lang Rust intent VM runs locally; its bytecode is separate from chain X3BC and
            is not loaded by a pallet. The recorded mainnet swap used NEAR Guard and 1Click.
          </Card>
        </CardGrid>
        <p className="mt-8 text-sm text-muted">
          <Tag>Limit</Tag>
          <span className="mt-3 block">
            This installation guide uses source. Check the current release artifacts separately.
            Programming notes live in the repo under docs/x3-lang. Judge steps:{" "}
            <OutLink href={LINKS.hackathonDocs}>docs/hackathon</OutLink>.
          </span>
        </p>
      </Section>
    </SiteShell>
  );
}
