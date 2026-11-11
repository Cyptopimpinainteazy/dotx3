import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Section, SiteShell } from '@/components/site-shell';
import { CompilerWorkbench } from '@/components/compiler-workbench';

export const Route = createFileRoute('/labs')({ component: Labs });
const views = [
  { id: 'compiler', label: '.x3 compiler', state: 'Real compiler API', path: null },
  { id: 'guard', label: 'Signed quote demo', state: 'Ported · dry quotes only', path: '/labs/guard/index.html' },
  { id: 'judge', label: 'Judge & policy tests', state: 'Ported · local policy preview', path: '/labs/guard/judge.html' },
  { id: 'attack', label: 'Attack lab', state: 'Ported · browser policy tests', path: '/labs/attack/attack-lab.html' },
] as const;
function Labs() {
  const [selected, setSelected] = useState<string>('compiler');
  const view = views.find(item => item.id === selected) || views[0];
  return <SiteShell eyebrow="Connected demos" title="One front door. Inspect every decision."
    lede="Language, quote verification, policy tests and attack demonstrations live here. Each view states what it actually checks. No scan, wallet action or deployment starts from this page.">
    <Section title="The .x3 workspace" intro="Ported directly from a pinned x3lang source commit. The compiler calls Python; the browser labs evaluate policy locally.">
      <div className="flex flex-wrap justify-center gap-3" role="tablist" aria-label="Demo views">
        {views.map(item => <button key={item.id} role="tab" aria-selected={selected === item.id}
          className={`min-h-11 rounded-lg border px-5 py-3 text-sm ${selected === item.id ? 'border-primary bg-primary text-bg' : 'border-border bg-surface text-fg'}`}
          onClick={() => setSelected(item.id)}>{item.label}</button>)}
      </div>
      <p className="my-5 text-center text-sm text-muted">{view.state}</p>
      {view.path ? <><a className="mb-3 block text-right text-primary" href={view.path} target="_blank" rel="noreferrer">Open full demo ↗</a>
        <iframe key={view.id} title={view.label} src={view.path} className="h-screen w-full rounded-xl border border-border" /></> : <CompilerWorkbench />}
    </Section>
    <Section title="Operations integrations" alt intro="These existing services retain their own access controls. A link is not a connected worker or an execution receipt.">
      <div className="grid gap-5 md:grid-cols-3">
        <article className="rounded-xl border border-border p-6"><h3 className="font-display text-xl text-primary">Control Room</h3><p className="my-4 text-muted">Existing readiness and planning workspace. Owner access may be required. Jobs are planning claims until a real worker returns evidence.</p><a className="text-primary" href="https://controlroom.x3star.net" target="_blank" rel="noreferrer">Open existing Control Room ↗</a><p className="mt-4 text-sm text-muted">Linked · operational controls not ported</p></article>
        <article className="rounded-xl border border-border p-6"><h3 className="font-display text-xl text-primary">Phantom</h3><p className="my-4 text-muted">Scan worker source, authenticated API, authorized target selection and report authenticity are required before scans can run here.</p><button className="min-h-11 rounded-lg border border-border px-4 text-muted" disabled>Worker integration pending</button><p className="mt-4 text-sm text-muted">Unverified · no scan started</p></article>
        <article className="rounded-xl border border-border p-6"><h3 className="font-display text-xl text-primary">Radar</h3><p className="my-4 text-muted">Radar's canonical source and data contract have not been identified. No invented targets, live telemetry or test results appear here.</p><button className="min-h-11 rounded-lg border border-border px-4 text-muted" disabled>Source integration pending</button><p className="mt-4 text-sm text-muted">Unverified · no telemetry connected</p></article>
      </div>
      <p className="mt-8 text-sm text-muted">Eye remains the desktop shell. <a className="text-primary" href="https://eye.x3star.net" target="_blank" rel="noreferrer">Open Eye ↗</a>. Port provenance: <a className="text-primary" href="/x3lang-port.json">source commit and file digests</a>.</p>
    </Section>
  </SiteShell>;
}
