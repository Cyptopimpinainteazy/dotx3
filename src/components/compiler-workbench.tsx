import { useEffect, useState } from 'react';

type Report = { decision: string; compiled: boolean; program_sha256: string; mandate_sha256: string;
  evidence_level: string; error?: { code: string; message: string }; policy?: { checks: { guard: string; ok: boolean }[] } };
type Sources = { program: string; mandate: string };
export function CompilerWorkbench() {
  const [sources, setSources] = useState<Sources>({ program: '', mandate: '' });
  const [original, setOriginal] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/labs/compiler/examples.json', { signal: controller.signal }).then(r => {
      if (!r.ok) throw Error('Examples unavailable'); return r.json();
    }).then((data: Sources) => { setSources(data); setOriginal(data.program); }).catch(e => {
      if (e.name !== 'AbortError') setError('Examples unavailable; paste public .x3 sources.');
    });
    return () => controller.abort();
  }, []);
  function edit(next: Sources) { setSources(next); setReport(null); setError(''); }
  async function compile(program = sources.program) {
    if (busy) return;
    const submitted = { ...sources, program };
    setSources(submitted); setBusy(true); setReport(null); setError('');
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('/api/compile', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitted), signal: controller.signal });
      if (!response.headers.get('content-type')?.includes('application/json')) throw Error('Compiler API is not deployed yet. Browser demonstrations remain available in the other tabs.');
      const result = await response.json();
      if (!response.ok) throw Error(result.error || 'Compiler unavailable');
      setReport(result);
    } catch (e) { setError(e instanceof Error ? e.message : 'Compiler unavailable; no decision produced'); }
    finally { clearTimeout(timeout); setBusy(false); }
  }
  function download() {
    if (!report) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify({ ...report, source: sources,
      purpose: 'owner_review_only_not_authorization' }, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'dotx3-review.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const labels: Record<string, string> = { preflight_passed: 'Compiles · local policy passes',
    denied_by_policy: 'Compiles · owner policy refuses', approval_required: 'Compiles · owner approval required',
    compile_error: 'Compiler rejected the program', mandate_error: 'Mandate could not be evaluated' };
  return <div className="rounded-xl border border-border bg-surface p-5 md:p-8">
    <p className="mb-5 text-sm text-muted">Staged example · illustrative accounts · user-supplied source, not a live model run. Never paste keys or private receipts.</p>
    <div className="grid gap-5 md:grid-cols-2">{(['mandate', 'program'] as const).map(field => <label key={field} className="block text-sm text-fg">
      {field === 'mandate' ? 'Owner mandate' : 'Agent payment intent'}<textarea aria-label={field} readOnly={busy} value={sources[field]}
        onChange={e => edit({ ...sources, [field]: e.target.value })} spellCheck={false}
        className="mt-3 h-96 w-full rounded-lg border border-border bg-bg p-4 font-mono text-xs leading-relaxed text-fg" /></label>)}</div>
    <div className="my-5 flex flex-wrap gap-3">
      <button disabled={busy} className="min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-bg" onClick={() => compile()}>{busy ? 'Compiling…' : 'Compile & check policy'}</button>
      <button disabled={busy} className="min-h-11 rounded-lg border border-border px-5 text-sm text-fg" onClick={() => {
        const next = sources.program.replace(/(to\s+Near\.USDC\s+receiver\s+)\S+/, '$1attacker.near');
        if (next === sources.program) { setError('No matching recipient to change; edit the source.'); return; } void compile(next);
      }}>Try recipient attack</button>
      <button disabled={busy} className="min-h-11 rounded-lg border border-border px-5 text-sm text-fg" onClick={() => compile(sources.program.replace(/^\s*require nonce unused[^\n]*\n/m, '\n'))}>Remove nonce & compile</button>
      <button disabled={busy} className="min-h-11 rounded-lg border border-border px-5 text-sm text-fg" onClick={() => edit({ ...sources, program: original })}>Restore intent</button>
    </div>
    <p className="text-xs text-muted">Mutations visibly edit the source. Policy assumes no prior spend and no revocation. Token metadata is a checked-in fixture. No wallet or chain authorization is established.</p>
    {error && <p className="mt-5 rounded-lg border border-accent p-4 text-accent" role="alert">{error}</p>}
    <div className="mt-7" aria-live="polite"><h3 className="font-display text-xl text-primary">{report ? labels[report.decision] || report.decision : 'No current decision'}</h3>
      {report && <><p className="my-3 text-sm text-muted">{report.error ? `${report.error.code}: ${report.error.message}` : report.evidence_level}</p>
        <div className="divide-y divide-border">{report.policy?.checks.map(check => <div key={check.guard} className="flex justify-between py-2 font-mono text-xs"><span>{check.guard}</span><strong className={check.ok ? 'text-primary' : 'text-accent'}>{check.ok ? 'PASS' : 'REFUSED'}</strong></div>)}</div>
        <p className="mt-4 break-all font-mono text-xs text-muted">Program SHA-256: {report.program_sha256}<br />Mandate SHA-256: {report.mandate_sha256}</p>
        <button className="mt-4 min-h-11 rounded-lg border border-border px-4 text-sm text-primary" onClick={download}>Download review packet</button>
        <details className="mt-4"><summary className="cursor-pointer text-primary">Full compiler report</summary><pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-all text-xs text-muted">{JSON.stringify(report, null, 2)}</pre></details></>}
    </div>
  </div>;
}
