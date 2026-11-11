import { Link, createFileRoute } from "@tanstack/react-router";
import { OutLink, Tag } from "@/components/code-block";
import { ProofFlow } from "@/components/circuit";
import { Card, CardGrid, Section, SiteShell } from "@/components/site-shell";
import { LINKS } from "@/lib/front-door";

export const Route = createFileRoute("/language")({ component: LanguagePage });

const REFUSALS: { code: string; what: string }[] = [
  {
    code: "X3_NEAR_ROUTE_SHAPE",
    what: "More than one leg, or a fallback. 1Click settles one swap, and a second leg could half-execute with no rollback.",
  },
  {
    code: "X3_NEAR_SLIPPAGE_REQUIRED",
    what: "No slippage bound. The compiler will not choose a tolerance on the agent's behalf.",
  },
  {
    code: "X3_NEAR_TIMEOUT_REQUIRED",
    what: "No timeout. The deadline is when 1Click starts refunding, so it has to be stated.",
  },
  {
    code: "X3_NEAR_NONCE",
    what: "A payment under a mandate with no one-use nonce, or with two. Guard records each payment under its nonce.",
  },
  {
    code: "X3_NEAR_REFUND_ASSET",
    what: "A refund in a different asset or on a different chain than the deposit. 1Click refunds the deposited asset only.",
  },
  {
    code: "X3_NEAR_REFUND_TO",
    what: "Timeout and on_fail refund to different addresses, or to an address that is not on the origin chain.",
  },
  {
    code: "X3_NEAR_GUARD_UNENFORCEABLE",
    what: "A require clause the NEAR path has no way to enforce. It is refused, never silently dropped.",
  },
  {
    code: "X3_NEAR_ON_FAIL_UNSUPPORTED",
    what: "on_fail halt or quarantine. 1Click can only refund, so the program would promise something that cannot happen.",
  },
  {
    code: "X3_NEAR_ROUTE_ENDPOINTS",
    what: "The leg's assets don't match the intent's from and to.",
  },
  {
    code: "X3_MANDATE_APPROVAL",
    what: "An agent listed as its own approver, an approval threshold above the cap, or an impossible threshold.",
  },
  { code: "X3_MANDATE_BOUND", what: "A mandate that leaves slippage or fees unbounded." },
  {
    code: "X3_MANDATE_LIMIT",
    what: "A per-payment cap above the daily cap, or a cap that does not fit the contract's u128.",
  },
];

const ENGINE: { title: string; body: string }[] = [
  {
    title: "One instruction set",
    body: "A no_std core crate is now the only definition of X3BC opcodes, the bytecode format, the gas table, swap math, receipts and traps. Before, the compiler and the VM each kept their own tables, and those tables disagreed.",
  },
  {
    title: "Trades that roll back as one",
    body: "Trading opcodes run inside an atomic window that journals every write. If any step fails, the whole window reverts. Each run produces an Ed25519-signed receipt, and a replay recomputes the economics independently.",
  },
  {
    title: "Compiled .x3 trades on the chain runtime",
    body: "A kernel call executes compiled trading bytecode against the chain's own DEX, flash-loan and oracle pallets, with metered weight and refunds. Trading stays switched off until governance sets fees.",
  },
  {
    title: "A language you can program in",
    body: "Arrays, tuples, structs, indexing and len() compile from source through HIR and MIR to bytecode. Block-context opcodes (sender, height, timestamp, value, chain id) fail closed when the host supplies no value.",
  },
  {
    title: "Robustness",
    body: "A property-test harness ran 8 million cases with zero panics. Parser recursion is capped at depth 64, and there is a never-panics fuzz harness.",
  },
  {
    title: "Bitcoin SPV, done properly",
    body: "An SPV verifier that accepted a forged all-zero header was replaced. The new crate implements Bitcoin's real consensus rules and is checked against real mainnet blocks and Bitcoin Core's retarget test vectors.",
  },
];

const IDEAS: { title: string; body: string; status: string }[] = [
  {
    title: "Guard enforces the program hash",
    status: "Next",
    body: "Main Guard stores an agent program's SHA-256 but does not check it. The Tidepool Guard already refuses an authorization whose program hash doesn't match the one the owner registered. Doing the same in agent_accept_quote would mean an approved mandate only carries the exact program the owner saw.",
  },
  {
    title: "Scoped agent vault",
    status: "Local prototypes",
    body: "NEAR FunctionCall-only and Base EIP-712 vault work has local Sandbox and Foundry coverage in the source repository. Public vault deployment and independent audits remain unproven; these prototypes did not custody the historical Tidepool transfer.",
  },
  {
    title: "Mandate diff before you sign",
    status: "Idea",
    body: "Compile the current and proposed mandate, then show the owner every term that changed (cap, recipients, refund address, expiry) before the create_mandate call goes out. The playground's checker can already produce both term sets.",
  },
  {
    title: "One checker, three runtimes",
    status: "Idea",
    body: "Lower check_mandate to X3BC so the same bytecode runs in the browser, on the X3 chain and in the Guard. That removes the hand-kept ports and gives one parity test where there are three today.",
  },
  {
    title: "Public refusal feed",
    status: "Idea",
    body: "An append-only feed of every agent proposal, with its .x3 hash, the verdict, the rule that decided it, and the transaction when there is one. Hostile-model runs would be labeled as attacks.",
  },
  {
    title: "LP mandates",
    status: "Idea",
    body: "The same mandate shape, applied to liquidity: which pools an LP agent may enter, how much, the maximum price impact, and a fixed withdrawal address. Liquidity managed by an agent, bounded by the owner.",
  },
];

function LanguagePage() {
  return (
    <SiteShell
      eyebrow="The language"
      title="X3 is more than one payment."
      lede="X3 Shield on NEAR uses a narrow, tested slice of X3. Here's the whole pipeline, what the compiler refuses, the chain engine behind it, and what we're building next."
    >
      <div className="mx-auto max-w-6xl px-5 pt-8">
        <a
          href="/bootcamp"
          className="tap inline-flex min-h-11 items-center rounded-lg border border-border px-5 text-primary"
        >
          Enter Bootcamp — the in-depth .x3 developer course →
        </a>
      </div>
      <Section
        title="Two pipelines, one language"
        intro="The hackathon path is the top line. The bottom line is the X3 chain, which is not part of the NEAR judge path."
      >
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <div className="mb-3">
              <Tag>NEAR Intents path · runs in the judge steps</Tag>
            </div>
            <ProofFlow
              steps={[
                { label: ".x3 source", detail: "Mandate and payment" },
                { label: "Compile", detail: "Parse, type-check, lower" },
                { label: "Guard terms", detail: "Hash-pinned on NEAR" },
                { label: "1Click quote", detail: "Signature, then terms" },
              ]}
            />
          </div>
          <div>
            <div className="mb-3">
              <Tag>X3 chain path · separate repository</Tag>
            </div>
            <ProofFlow
              steps={[
                { label: ".x3 source", detail: "Strategies and programs" },
                { label: "Rust compiler", detail: "HIR, MIR, backend" },
                { label: "X3BC", detail: "One canonical bytecode" },
                { label: "X3VM", detail: "Atomic, signed receipts" },
              ]}
            />
          </div>
        </div>
      </Section>

      <Section
        title="What the compiler refuses"
        intro="These programs never reach a quote. Each code is a real refusal in the checker that the playground runs."
        alt
      >
        <div className="mx-auto grid max-w-5xl gap-3 md:grid-cols-2">
          {REFUSALS.map((r) => (
            <article key={r.code} className="rounded-xl border border-border bg-bg p-4">
              <p className="font-mono text-xs break-all text-accent">{r.code}</p>
              <p className="mt-2 text-sm text-muted">{r.what}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/playground"
            className="tap inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-bg"
          >
            Trigger them in the playground
          </Link>
        </div>
      </Section>

      <Section
        title="The chain engine"
        intro="Work in the X3 chain monorepo on unifying X3 Lang with the production X3BC bytecode and VM."
      >
        <div className="mx-auto mb-8 flex max-w-3xl flex-wrap justify-center gap-2">
          <Tag>Repository not public</Tag>
          <Tag>Draft PR, not merged to master</Tag>
          <Tag>Runtime tests, not a live chain</Tag>
          <Tag>Status as of 2026-10-19</Tag>
        </div>
        <CardGrid>
          {ENGINE.map((e) => (
            <Card key={e.title} title={e.title}>
              {e.body}
            </Card>
          ))}
        </CardGrid>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted">
          You can&apos;t check any of this from here: the repository is private, so nothing on this
          page links to it. It is listed so the language&apos;s scope is clear. None of it is part
          of the NEAR submission, and none of it is cited as evidence on{" "}
          <Link to="/proof" className="text-primary underline underline-offset-4">
            Inspect the Proof
          </Link>
          .
        </p>
      </Section>

      <Section title="What we're building next" alt>
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          {IDEAS.map((idea) => (
            <article key={idea.title} className="rounded-xl border border-border bg-bg p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg text-fg">{idea.title}</h3>
                <Tag>{idea.status}</Tag>
              </div>
              <p className="mt-3 text-sm text-muted">{idea.body}</p>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted">
          Want one of these sooner, or have a better one?{" "}
          <OutLink href={LINKS.issues}>Open an issue</OutLink> or{" "}
          <Link to="/back" className="text-primary underline underline-offset-4">
            back the work
          </Link>
          .
        </p>
      </Section>
    </SiteShell>
  );
}
