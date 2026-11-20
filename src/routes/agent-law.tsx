import { createFileRoute } from "@tanstack/react-router";
import { ActionLink, Card, CardGrid, Section, SiteShell } from "@/components/site-shell";
import { CodeBlock, OutLink } from "@/components/code-block";
import { AGENT_LAW_BLOB, AGENT_LAW_SOURCE, AGENT_LAW_STAGES } from "@/lib/agent-law";

export const Route = createFileRoute("/agent-law")({ component: AgentLaw });

function AgentLaw() {
  return (
    <SiteShell
      eyebrow="Agent law · local prototype"
      title="Born with rules. Stopped at the boundary."
      lede="Signed identity, scoped authority, real .x3 compilation, durable retirement and evidence for review. This is a working local lifecycle, separate from the mainnet Guard demonstration."
      actions={<><a className="tap inline-flex min-h-11 items-center rounded-full bg-primary px-6 font-semibold text-bg" href="#recorded-demo">Inspect the recorded demo</a><ActionLink to="/labs" outline>Explore Labs</ActionLink></>}
    >
      <Section title="Working locally, not deployed enforcement" id="scope">
        <div className="mx-auto max-w-3xl rounded-xl border border-accent/40 bg-surface p-6 text-muted">
          <p className="font-semibold text-accent">Evidence snapshot · November 13, 2026</p>
          <p className="mt-3">The demo uses real SQLite, Ed25519 signatures and the existing .x3 intent compiler. It emits a payment plan; it does not send a payment. Opening this page only reads recorded evidence.</p>
          <p className="mt-3">The local runtime is not deployed to mainnet or wired into every agent, wallet or contract. Its jury demonstration uses scripted signing identities, not independent AI judgments.</p>
          <p className="mt-3">Source is pinned to <OutLink href={AGENT_LAW_BLOB + "/docs/security/AGENT_LAW_RUNTIME.md"}>X3Lang {AGENT_LAW_SOURCE.slice(0, 7)}</OutLink>. <OutLink href="https://github.com/Cyptopimpinainteazy/x3lang/pull/234">Implementation review #234</OutLink> is separate from deployment.</p>
        </div>
      </Section>

      <Section title="The agent-law lifecycle" id="lifecycle" alt intro="The original Ten Commandments remain the constitutional foundation. This prototype implements selected execution and review boundaries; it does not claim complete constitutional enforcement.">
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {AGENT_LAW_STAGES.map((stage) => (
            <li key={stage.step} className="rounded-xl border border-border bg-bg p-6">
              <p className="font-display text-sm text-primary">{stage.step} / {stage.state}</p>
              <h3 className="mt-3 font-display text-2xl text-fg">{stage.title}</h3>
              <p className="mt-4 text-muted">{stage.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="What the recorded demo proves" id="recorded-demo" intro="A repeatable local run, with exact source and output preserved. These results describe the pinned snapshot, not a live service check.">
        <CardGrid>
          <Card title="A permitted plan compiles">
            <p>A signed child action compiles the real payment source into a plan for x3-demo.near. The intent contains 25 USDC of example terms; no assets move.</p>
          </Card>
          <Card title="A redirected plan is refused">
            <p>Changing the recipient to attacker.near violates the host envelope. The runtime records the rejected source and retires the child identity.</p>
          </Card>
          <Card title="Restart cannot erase the stop">
            <p>The demo reopens the database and refuses later work by the retired child. A repeated signed action is also refused instead of executing twice.</p>
          </Card>
        </CardGrid>
        <div className="mx-auto mt-8 max-w-3xl space-y-4 text-muted">
          <p>Two scripted juror keys sign findings over the incident. The court exports a rejection regression proposal and leaves the agent retired. That proves signature and exclusion checks, not the quality of an independent model judgment.</p>
          <p>The accompanying tests cover concurrent budget reservations, forged signatures, cross-registry replay, related-agent juries, revoked jurors and a hard process exit after reservation. A pending action remains uncertain and cannot automatically retry or refund.</p>
          <p className="rounded-lg border border-border p-4">Recorded full Python suite: <strong className="text-fg">1,028 passed, 1 skipped, 102 subtests passed.</strong> This is the repository-wide suite, not 1,028 agent-law tests. The verification record includes the command, environment and tested-file hashes.</p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <OutLink href="/evidence/agent-law/lifecycle.json">Recorded lifecycle JSON</OutLink>
          <OutLink href="/evidence/agent-law/verification.json">Verification and source hashes</OutLink>
          <OutLink href="/evidence/agent-law/python-tests.txt">Full suite result</OutLink>
          <OutLink href="/evidence/agent-law/provenance.json">Copied-file provenance</OutLink>
        </div>
      </Section>

      <Section title="Reproduce it locally" id="reproduce" alt intro="Use the pinned source and a project virtual environment. This page does not run the Python runtime in your browser.">
        <div className="mx-auto max-w-4xl">
          <CodeBlock title="Local lifecycle demo · no wallet or RPC" code={"git clone https://github.com/Cyptopimpinainteazy/x3lang.git\ncd x3lang\ngit checkout " + AGENT_LAW_SOURCE + "\npython3 -m venv .venv\n.venv/bin/python -m pip install -r x3-lang/requirements-agent-security.txt pytest\n.venv/bin/python scripts/hackathon/agent_law_local_demo.py --output /tmp/agent-law-proof.json\nPYTHONPATH=x3-lang .venv/bin/python -m pytest x3-lang/tests/test_agent_runtime*.py -q"} />
          <div className="mt-5 flex flex-wrap gap-5">
            <OutLink href={AGENT_LAW_BLOB + "/scripts/hackathon/agent_law_local_demo.py"}>Demo runner</OutLink>
            <OutLink href={AGENT_LAW_BLOB + "/x3-lang/agent_runtime.py"}>Runtime implementation</OutLink>
            <OutLink href={AGENT_LAW_BLOB + "/x3-lang/agent_runtime_court.py"}>Incident court</OutLink>
            <OutLink href={AGENT_LAW_BLOB + "/docs/security/AGENT_LAW_RUNTIME.md"}>Scope and trust boundaries</OutLink>
          </div>
        </div>
      </Section>

      <Section title="What is still local or not implemented" id="limits">
        <div className="mx-auto max-w-4xl overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-border text-primary"><th className="p-4" scope="col">Capability</th><th className="p-4" scope="col">Evidence level and boundary</th></tr></thead>
            <tbody className="text-muted">
              <tr className="border-b border-border"><th className="p-4 font-medium text-fg" scope="row">Birth, budget, replay and retirement</th><td className="p-4">Implemented and tested locally using real SQLite and signatures. No production identity or key-issuance integration is established.</td></tr>
              <tr className="border-b border-border"><th className="p-4 font-medium text-fg" scope="row">Compilation and execution</th><td className="p-4">The demonstrated adapter compiles .x3 intent plans. It does not execute arbitrary agent code or hold, sign for, or transfer funds.</td></tr>
              <tr className="border-b border-border"><th className="p-4 font-medium text-fg" scope="row">Court and jury duty</th><td className="p-4">Local authenticated approval and finding protocols. Anonymous commit-reveal, randomized rotation and independent AI judgment are not demonstrated.</td></tr>
              <tr className="border-b border-border"><th className="p-4 font-medium text-fg" scope="row">Learning from violations</th><td className="p-4">Signed regression proposals can be exported. Automatic model training, code changes and policy promotion are not implemented.</td></tr>
              <tr className="border-b border-border"><th className="p-4 font-medium text-fg" scope="row">Isolation and evidence</th><td className="p-4">Trusted operator wrapper, not an OS sandbox. Local event hashes are not blockchain immutability or rollback-proof history.</td></tr>
              <tr><th className="p-4 font-medium text-fg" scope="row">Mainnet protection</th><td className="p-4">Separate evidence: Guard checks signed quote terms but did not custody the Solana funds. This local lifecycle adds no new mainnet enforcement.</td></tr>
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center"><ActionLink to="/judge" outline>Inspect the separate mainnet evidence</ActionLink></div>
      </Section>
    </SiteShell>
  );
}
