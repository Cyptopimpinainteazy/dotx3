import { useState } from 'react';
import type { ExplorerPage } from '@/lib/explorer/client.mjs';

export function ExplorerEvidence() {
  const [page,setPage] = useState<ExplorerPage | null>(null);
  const [status,setStatus] = useState('');
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState('Load the configured project history. No wallet connection or transaction signing.');
  async function load(next = false) {
    setBusy(true); setMessage('Reading Explorer history…');
    const params = new URLSearchParams();
    if (status) params.set('statuses',status);
    if (next && page?.nextCursor) {
      params.set('lastDepositAddress',page.nextCursor.lastDepositAddress);
      if (page.nextCursor.lastDepositMemo != null) params.set('lastDepositMemo',page.nextCursor.lastDepositMemo);
    }
    try {
      const response = await fetch(`/api/explorer/transactions?${params}`,{cache:'no-store'});
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 429) throw new Error(`Partner request limit reached. Retry in ${response.headers.get('Retry-After') || '5'} seconds.`);
        if (['EXPLORER_NOT_CONFIGURED','EXPLORER_SCOPE_NOT_CONFIGURED'].includes(data.error))
          throw new Error('Explorer is not configured yet. No live transaction history has been loaded.');
        throw new Error('Explorer is unavailable. No settlement conclusion can be drawn.');
      }
      setPage(data); setMessage(data.transactions.length ? 'Provider-reported records loaded.' : 'No matching records returned. This does not prove that no swap occurred.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Explorer unavailable.'); }
    finally {setBusy(false);}
  }
  return <div className="space-y-4">
    <p className="text-muted">Historical 1Click records · provider-reported · independently verified: no. These records do not establish X3 Guard authorization or cross-chain atomicity.</p>
    <div className="flex flex-wrap items-end gap-3">
      <label className="text-sm text-muted">Reported status
        <select className="ml-3 min-h-11 rounded border border-border bg-surface p-2 text-fg" value={status} disabled={busy}
          onChange={event=>{setStatus(event.target.value);setPage(null);}}>
          <option value="">All statuses</option>
          {['SUCCESS','FAILED','REFUNDED','PROCESSING','PENDING_DEPOSIT','INCOMPLETE_DEPOSIT'].map(value=><option key={value}>{value}</option>)}
        </select>
      </label>
      <button className="min-h-11 rounded border border-border px-4 text-fg disabled:opacity-50" disabled={busy} onClick={()=>load()}>Load history</button>
      {page?.nextCursor && <button className="min-h-11 rounded border border-border px-4 text-fg disabled:opacity-50" disabled={busy} onClick={()=>load(true)}>Older records</button>}
    </div>
    <p role="status" aria-live="polite" className="text-sm text-muted">{message}</p>
    {page && <p className="text-sm text-muted">Observed: {page.observedAt} · {page.cached ? 'Cached response' : 'Fresh response'}. Previously loaded records remain visible if a refresh fails.</p>}
    <div className="grid gap-3">
      {page?.transactions.map((row,index)=><article key={`${row.depositAddress}:${row.depositMemo}:${index}`} className="min-w-0 rounded-xl border border-border bg-surface p-4">
        <p className="font-display text-fg">{row.status} <span className="text-sm text-muted">· Explorer-reported</span></p>
        <dl className="mt-2 grid gap-2 break-all text-sm text-muted">
          <div><dt>Deposit address / memo</dt><dd>{row.depositAddress}{row.depositMemo != null ? ` / ${row.depositMemo}` : ''}</dd></div>
          <div><dt>Recipient</dt><dd>{row.recipient || 'Not reported'}</dd></div>
          <div><dt>Input</dt><dd>{row.amountInFormatted || 'Not reported'} · {row.originAsset}</dd></div>
          <div><dt>Output</dt><dd>{row.amountOutFormatted || 'Not reported'} · {row.destinationAsset}</dd></div>
          <div><dt>Created</dt><dd>{row.createdAt || 'Not reported'}</dd></div>
        </dl>
      </article>)}
    </div>
  </div>;
}
