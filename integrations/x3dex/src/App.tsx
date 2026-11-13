import PageExport from './PageExport'
import TestnetLab from './features/testnet/TestnetLab'
import WalletConnect from './features/WalletConnect'
import ArbitrageRadar from './features/arbitrage/ArbitrageRadar'
import { useEffect, useRef, useState } from 'react'
import { createChart, CandlestickSeries, HistogramSeries, ColorType } from 'lightweight-charts'
import type { CandlestickData, UTCTimestamp, HistogramData } from 'lightweight-charts'
import { Activity, ArrowDownUp, BarChart3, Bell, ChevronDown, CircleHelp, Compass, ExternalLink, GitBranch, Layers, LockKeyhole, RefreshCw, Search, Settings2, ShieldCheck, Zap } from 'lucide-react'
import './App.css'

type Market = { label: string; pair: string; base: string; quote: string }
const markets: Market[] = [
  { label: 'BTC / USD', pair: 'XBTUSD', base: 'BTC', quote: 'USD' },
  { label: 'ETH / USD', pair: 'ETHUSD', base: 'ETH', quote: 'USD' },
  { label: 'SOL / USD', pair: 'SOLUSD', base: 'SOL', quote: 'USD' },
  { label: 'AVAX / USD', pair: 'AVAXUSD', base: 'AVAX', quote: 'USD' },
]
type Candle = { time: UTCTimestamp; open: number; high: number; low: number; close: number; volume: number }
const fmt = (v: number, decimals = 2) => Number.isFinite(v) ? v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : '—'
function Chart({ candles }: { candles: Candle[] }) {
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!container.current || !candles.length) return
    const chart = createChart(container.current, { layout: { background: { type: ColorType.Solid, color: '#0c1424' }, textColor: '#8899b4', fontFamily: 'Inter, system-ui, sans-serif' }, grid: { vertLines: { color: '#1a273a' }, horzLines: { color: '#1a273a' } }, width: container.current.clientWidth, height: 475, rightPriceScale: { borderColor: '#223249' }, timeScale: { borderColor: '#223249', timeVisible: true }, crosshair: { vertLine: { color: '#587ca7' }, horzLine: { color: '#587ca7' } } })
    const candlesSeries = chart.addSeries(CandlestickSeries, { upColor: '#16c7aa', downColor: '#f26479', borderVisible: false, wickUpColor: '#16c7aa', wickDownColor: '#f26479' })
    candlesSeries.setData(candles.map(({ time, open, high, low, close }): CandlestickData<UTCTimestamp> => ({ time, open, high, low, close })))
    const vol = chart.addSeries(HistogramSeries, { priceFormat: { type: 'volume' }, priceScaleId: '' })
    vol.priceScale().applyOptions({ scaleMargins: { top: 0.81, bottom: 0 } })
    vol.setData(candles.map(({ time, volume, open, close }): HistogramData<UTCTimestamp> => ({ time, value: volume, color: close >= open ? '#16c7aa44' : '#f2647944' })))
    chart.timeScale().fitContent()
    const observer = new ResizeObserver(() => chart.applyOptions({ width: container.current?.clientWidth ?? 800 }))
    observer.observe(container.current)
    return () => { observer.disconnect(); chart.remove() }
  }, [candles])
  return <div className="chart" ref={container} role="img" aria-label="Real market candlestick and volume chart" />
}
const nav = [{ name: 'Terminal', icon: BarChart3 }, { name: 'Cross-chain', icon: GitBranch }, { name: 'Arbitrage Radar', icon: Zap }, { name: 'Testnet Lab', icon: ShieldCheck }, { name: 'Portfolio', icon: Layers }, { name: 'Strategies', icon: Activity }, { name: 'Explorer', icon: Compass }]
const chains = ['Ethereum', 'Base', 'Solana', 'NEAR', 'X3']
function App() {
  const [market, setMarket] = useState(markets[0]); const [rawCandles, setCandles] = useState<Candle[]>([])
  const [status, setStatus] = useState('Loading real market data…'); const [loading, setLoading] = useState(true)
  const [snapshotKey, setSnapshotKey] = useState('');
  const [interval, setIntervalValue] = useState('60'); const [active, setActive] = useState('Terminal')
  const candles = snapshotKey === market.pair + ':' + interval ? rawCandles : [];
  const [source, setSource] = useState('Base'); const [destination, setDestination] = useState('NEAR')
  const [amount, setAmount] = useState('100'); const [search, setSearch] = useState(''); const [lastUpdated, setLastUpdated] = useState('')
  useEffect(() => {
    let cancelled = false
    setCandles([]); setLastUpdated(''); setLoading(true); setStatus('Loading real market data…')
    const load = async () => {
      try {
        const resp = await fetch('/api/x3dex/ohlc?pair=' + encodeURIComponent(market.pair) + '&interval=' + interval)
        if (!resp.ok) throw new Error('Market feed returned HTTP ' + resp.status)
        const payload = await resp.json() as { error?: string[]; result?: Record<string, unknown> }
        if (payload.error?.length) throw new Error(payload.error.join(', '))
        const pairKey = Object.keys(payload.result ?? {}).find(k => k !== 'last')
        const rows = pairKey ? payload.result?.[pairKey] : undefined
        if (!Array.isArray(rows)) throw new Error('Unexpected OHLC response')
        const parsed: Candle[] = rows.map((r: unknown) => {
          const row = r as (string | number)[]
          return { time: Number(row[0]) as UTCTimestamp, open: Number(row[1]), high: Number(row[2]), low: Number(row[3]), close: Number(row[4]), volume: Number(row[6]) }
        }).filter(c => [c.time,c.open,c.high,c.low,c.close,c.volume].every(Number.isFinite)).sort((a,b) => a.time-b.time)
        if (!cancelled) { setCandles(parsed); setSnapshotKey(market.pair + ':' + interval); setStatus('Kraken public spot OHLC · reference data'); setLastUpdated(new Date().toLocaleTimeString()); setLoading(false) }
      } catch (error) { if (!cancelled) { setStatus('Feed unavailable: ' + (error instanceof Error ? error.message : String(error))); setCandles([]); setLoading(false) } }
    }
    load(); const timer = setInterval(load, 30000)
    return () => { cancelled = true; clearInterval(timer) }
  }, [market, interval])
  const last = candles.at(-1)?.close; const first = candles[0]?.open; const change = last && first ? (last / first - 1) * 100 : 0
  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">✳</span><span>X3<span className="cyan">DEX</span></span><span className="brand-dot">●</span></div>
      <div className="section-label">WORKSPACE</div>
      {nav.map(({ name, icon: Icon }) => <button className={'nav-item ' + (active === name ? 'selected' : '')} key={name} onClick={() => setActive(name)}><Icon size={18} />{name}{!['Terminal','Arbitrage Radar','Testnet Lab'].includes(name) && <span className="soon">ROADMAP</span>}</button>)}
      <div className="section-label markets-title">MARKET WATCHLIST</div>
      <label className="search"><Search size={15} /><input aria-label="Search markets" placeholder="Search markets" value={search} onChange={e => setSearch(e.target.value)} /></label>
      <div className="market-list">{markets.filter(m => m.label.toLowerCase().includes(search.toLowerCase())).map(m => <button key={m.pair} className={'market-item ' + (m.pair === market.pair ? 'market-active' : '')} onClick={() => { setMarket(m); setActive('Terminal') }}><span className="token-icon">{m.base.slice(0, 1)}</span><span>{m.label}<small>Kraken spot</small></span><span className="market-arrow">↗</span></button>)}</div>
      <div className="sidebar-bottom"><div className="network-dot" /> MARKET DATA ONLINE WHEN FEED CONNECTS <p>Execution routes disabled until verified.</p></div>
    </aside>
    <div className="workspace">
      <header className="header"><div className="mobile-brand"><span className="cyan">✳</span> X3DEX</div><div className="breadcrumb">X3 ECOSYSTEM <span>/</span> {active.toUpperCase()}</div><div className="header-right"><div className="testnet-badge"><span>●</span> BUILD IN PROGRESS</div><button className="icon-button" aria-label="Notifications" title="Notifications not configured"><Bell size={18} /></button><button className="icon-button" aria-label="Settings" title="Settings planned"><Settings2 size={18} /></button><WalletConnect /></div></header>
      <nav className="mobile-tabs" aria-label="DEX modules">{nav.map(({name}) => <button key={name} className={active === name ? "selected" : ""} onClick={() => setActive(name)}>{name}</button>)}</nav>
      <main data-dex-page-content>
        <PageExport />
        {active === 'Testnet Lab' ? <TestnetLab /> : active === 'Arbitrage Radar' ? <ArbitrageRadar /> : <>
        <div className="page-top"><div><div className="eyebrow"><Zap size={14} /> UNIFIED MULTICHAIN TRADING</div><h1>{active === 'Terminal' ? 'Trading terminal' : active}</h1><p>Real-time market intelligence. Verifiable execution infrastructure.</p></div><span className="beta">PRIVATE DEVELOPMENT BUILD · NO EXECUTION</span></div>
        {active !== 'Terminal' && <div className="notice"><CircleHelp size={18}/><span>The {active.toLowerCase()} module is planned but not yet integrated. Live trading remains disabled. Return to Terminal to explore real public market data.</span><button onClick={() => setActive('Terminal')}>Open terminal →</button></div>}
        <div className="stats-row"><div className="stat"><span>SELECTED MARKET</span><strong>{market.label}</strong><small>Kraken spot reference</small></div><div className="stat"><span>LAST TRADED PRICE</span><strong>{last ? '$' + fmt(last) : '—'}</strong><small>{lastUpdated ? 'Updated ' + lastUpdated : status}</small></div><div className="stat"><span>CHART WINDOW CHANGE</span><strong className={change >= 0 ? 'positive' : 'negative'}>{candles.length ? (change >= 0 ? '+' : '') + fmt(change) + '%' : '—'}</strong><small>First to latest candle · not 24h</small></div><div className="stat"><span>EXECUTION STATUS</span><strong className="muted">Disabled</strong><small>Security integration pending</small></div></div>
        <div className="terminal-grid">
          <section className="card chart-card"><div className="card-head"><div><h2><span className="asset-symbol">{market.base}</span> {market.base} / {market.quote} <ChevronDown size={15} /></h2><span className="data-source">{status}</span></div><div className="intervals">{[['1','1m'],['5','5m'],['15','15m'],['60','1h'],['240','4h'],['1440','1D']].map(([i,label]) => <button key={i} className={interval === i ? 'chosen' : ''} onClick={() => setIntervalValue(i)}>{label}</button>)}</div></div><div className="chart-shell">{loading ? <div className="chart-placeholder">Connecting to verified market feed…</div> : candles.length ? <Chart candles={candles} /> : <div className="chart-placeholder">No market data available. Check the feed and retry.</div>}</div><footer className="chart-footer"><span><span className="live-dot"/> Kraken public OHLC · informational only</span><span>Auto-refresh: 30s <RefreshCw size={13} /></span></footer></section>
          <section className="card trade-card"><div className="trade-heading"><h2><ArrowDownUp size={18}/> Cross-chain swap</h2><span className="locked"><LockKeyhole size={12}/> NOT ENABLED</span></div><div className="trade-content"><div className="field-label">YOU PAY <span>Source network</span></div><div className="swap-input"><input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} aria-label="Amount to swap" /><select aria-label="Source network" value={source} onChange={e => setSource(e.target.value)}>{chains.map(c => <option key={c}>{c}</option>)}</select></div><div className="token-hint">Token selection and balances require wallet and router integration.</div><div className="swap-divider"><button aria-label="Reverse source and destination networks" onClick={() => { setSource(destination); setDestination(source) }}><ArrowDownUp size={17}/></button></div><div className="field-label">YOU RECEIVE <span>Destination network</span></div><div className="swap-input"><span className="unknown-output">—</span><select aria-label="Destination network" value={destination} onChange={e => setDestination(e.target.value)}>{chains.map(c => <option key={c}>{c}</option>)}</select></div><div className="token-hint">No verified executable quote available.</div><div className="quote-details"><div><span>Expected output</span><strong>Unavailable</strong></div><div><span>Cross-chain route</span><strong>Not verified</strong></div><div><span>Settlement proof</span><strong>Not available</strong></div><div><span>Network fees</span><strong>Not quoted</strong></div></div><button className="execute" disabled><ShieldCheck size={18}/> Execution disabled · integration required</button><div className="security"><ShieldCheck size={16}/> This swap panel cannot initiate signatures or trades. Testnet Lab has a separate self-transfer test.</div></div></section>
        </div>
        <div className="bottom-grid"><section className="card"><div className="card-head"><h2><GitBranch size={17}/> X3 Settlement pipeline</h2><span className="neutral-pill">ARCHITECTURE</span></div><div className="pipeline">{['X3 Router','Shield Guard','Execution Layer','Finality Proofs','Verified Receipt'].map((s,i) => <div className="stage" key={s}><span>{String(i+1).padStart(2,'0')}</span><strong>{s}</strong><small>{i===0 ? 'Route selection' : i===1 ? 'Policy enforcement' : i===2 ? 'EVM · SVM · X3VM · NEAR adapter' : i===3 ? 'Chain-specific finality' : 'Reconciled settlement'}</small></div>)}</div><p className="disclaimer">Target architecture, not a claim that these adapters are connected or production-ready in this application.</p></section><section className="card"><div className="card-head"><h2><ShieldCheck size={17}/> Security posture</h2><span className="neutral-pill">FAIL CLOSED</span></div><div className="posture"><div><span className="posture-icon"><LockKeyhole size={18}/></span><span><strong>Signing disabled</strong><small>Read-only EVM connection available; signing disabled</small></span></div><div><span className="posture-icon"><ShieldCheck size={18}/></span><span><strong>Route authorization required</strong><small>X3 Force Field enforcement pending integration</small></span></div><div><span className="posture-icon"><ExternalLink size={18}/></span><span><strong>Proof verification required</strong><small>No unverified settlement success claims</small></span></div></div></section></div>
        <footer className="site-footer">X3 DEX · Private development · Independent trading product <span>Market data ≠ executable liquidity · No hackathon submission</span></footer>
        </>}
      </main>
    </div>
  </div>
}
export default App
