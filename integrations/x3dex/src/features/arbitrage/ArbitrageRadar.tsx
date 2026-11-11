import IndicativeQuotePanel from './IndicativeQuotePanel'
import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, ExternalLink, GitBranch, LockKeyhole, RefreshCw, ShieldAlert, SlidersHorizontal, Waves, Zap } from 'lucide-react'
import './ArbitrageRadar.css'

// Native USDC addresses; never infer token identity from symbol alone.
// https://developers.circle.com/stablecoins/usdc-contract-addresses
const ASSETS = [
  { chain: 'ethereum', display: 'Ethereum', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
  { chain: 'base', display: 'Base', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' },
  { chain: 'solana', display: 'Solana', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
] as const
type Pool = {
  chainId: string; dexId: string; pairAddress: string; url: string
  baseToken: { address: string; symbol: string }; quoteToken: { address: string; symbol: string }
  priceUsd?: string; liquidity?: { usd?: number }; volume?: { h24?: number }
  pairCreatedAt?: number
}
type Observed = Pool & { chain: string; price: number; liquidityUsd: number; volumeUsd: number }
type Opportunity = { buy: Observed; sell: Observed; spreadPct: number }
const usd = (value: number, max = 2) => Number.isFinite(value) ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: max }) : '—'
const pct = (value: number) => Number.isFinite(value) ? value.toFixed(3) + '%' : '—'
const sameAddress = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()
const MIN_LIQUIDITY = 50_000
const REFRESH_MS = 45_000
export default function ArbitrageRadar() {
  const [pools, setPools] = useState<Observed[]>([])
  const [lastFetch, setLastFetch] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [feeBps, setFeeBps] = useState('30')
  const [gasUsd, setGasUsd] = useState('8')
  const [settlementUsd, setSettlementUsd] = useState('5')
  const [notional, setNotional] = useState('1000')
  const [minLiquidity, setMinLiquidity] = useState('50000')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    let running = true
    const load = async () => {
      try {
        // Fetch each token by its EXACT Circle-issued contract / Solana mint.
        // No broad symbol searches or unverified wrapped/bridged assets.
        const response = await fetch('/api/x3dex/markets')
        if (!response.ok) throw new Error('Market backend HTTP ' + response.status)
        const payload: { pools: Pool[]; stale: boolean; partial: boolean; errors: string[]; asOf: number | null } = await response.json()
        if (!Array.isArray(payload.pools)) throw new Error('Invalid market backend response')
        if (!running) return
        const observed: Observed[] = payload.pools.filter(p =>
          typeof p.chainId === 'string' && ASSETS.some(asset => asset.chain === p.chainId && sameAddress(p.baseToken.address, asset.address))
        ).map(p => ({
          ...p, chain: ASSETS.find(a => a.chain === p.chainId)!.display,
          price: Number(p.priceUsd), liquidityUsd: Number(p.liquidity?.usd ?? 0),
          volumeUsd: Number(p.volume?.h24 ?? 0),
        })).filter(p => Number.isFinite(p.price) && p.price > 0 &&
          Number.isFinite(p.liquidityUsd) && p.liquidityUsd >= MIN_LIQUIDITY)
        setPools(payload.stale ? [] : observed)
        setError(payload.stale ? 'Source stale or unavailable; observations hidden' : payload.partial ? payload.errors.join(' · ') : '')
        setLastFetch(payload.asOf)
        setLoading(false)
      } catch (e) {
        if (running) { setError(e instanceof Error ? e.message : String(e)); setLoading(false) }
      }
    }
    void load()
    const timer = window.setInterval(() => void load(), REFRESH_MS)
    return () => { running = false; window.clearInterval(timer) }
  }, [])

  const eligible = useMemo(() => pools.filter(p => p.liquidityUsd >= (Number(minLiquidity) || 0)), [pools, minLiquidity])
  const opportunities = useMemo(() => {
    const results: Opportunity[] = []
    for (let i = 0; i < eligible.length; i++) for (let j = i + 1; j < eligible.length; j++) {
      const a = eligible[i], b = eligible[j]
      if (a.chainId === b.chainId || a.price === b.price) continue
      const [buy, sell] = a.price < b.price ? [a, b] : [b, a]
      if (filter !== 'all' && buy.chainId !== filter && sell.chainId !== filter) continue
      results.push({ buy, sell, spreadPct: (sell.price / buy.price - 1) * 100 })
    }
    return results.sort((a, b) => b.spreadPct - a.spreadPct).slice(0, 20)
  }, [eligible, filter])
  const top = opportunities[0]
  const assumptionsValid = [feeBps,gasUsd,settlementUsd,notional].every(v => v.trim() !== '' && Number.isFinite(Number(v)) && Number(v) >= 0) && Number(notional) > 0
  const estimate = (spreadPct: number) => {
    if (!assumptionsValid) return null
    const gross = Number(notional) * spreadPct / 100
    // These are USER assumptions, not a quoted or executable route.
    return gross - Number(notional) * Number(feeBps) / 10000 - Number(gasUsd) - Number(settlementUsd)
  }
  const topEstimate = top ? estimate(top.spreadPct) : null
  const selectedChains = new Set(eligible.map(p => p.chainId))
  return <div className="arb-dashboard">
    <div className="arb-hero"><div><div className="arb-tag"><Activity size={14}/> X3 INTELLIGENCE / CROSS-CHAIN</div><h1>Arbitrage <span>Radar</span></h1><p>Authenticated asset identities. Real DEX pool observations. Zero fabricated execution routes.</p></div><div className="arb-hero-status"><span className={error ? 'arb-bad' : 'arb-ok'}>●</span> {loading ? 'Connecting to DEX feeds' : error ? 'Partial / degraded feed' : 'DEX pool feed online'}<small>{lastFetch ? 'Updated ' + new Date(lastFetch).toLocaleTimeString() : 'No observations yet'} · 45s refresh</small></div></div>
    <div className="arb-warning"><ShieldAlert size={19}/><div><strong>Discovery only — NOT an executable arbitrage quote.</strong><span>DEX Screener USD spot prices are indicative, may be delayed, and do not include executable pool depth, gas, bridging, price impact, MEV, finality, or route guarantees. Cross-chain settlement and auto-execution remain disabled.</span></div></div>
    <div className="arb-kpis">
      <div><span>OBSERVED USDC POOLS</span><strong>{loading ? '…' : eligible.length}</strong><small>Native issuer token · ≥ configured liquidity</small></div>
      <div><span>CHAINS WITH DATA</span><strong>{loading ? '…' : selectedChains.size} <em>/ {ASSETS.length}</em></strong><small>Ethereum · Base · Solana</small></div>
      <div><span>MAX OBSERVED SPREAD</span><strong className="arb-cyan">{top ? pct(top.spreadPct) : '—'}</strong><small>Cross-chain pool mid/reference prices</small></div>
      <div><span>HYPOTHETICAL NET</span><strong className={topEstimate !== null && topEstimate >= 0 ? 'arb-green' : ''}>{topEstimate !== null ? usd(topEstimate) : '—'}</strong><small>Unquoted user assumptions · not profit</small></div>
    </div>
    <div className="arb-grid">
      <section className="arb-card arb-main">
        <div className="arb-card-head"><div><h2><Waves size={18}/> Cross-chain spread scanner</h2><p>Price discrepancy analysis for exact Circle native USDC identities</p></div><select aria-label="Filter observed chain" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All chains</option>{ASSETS.map(c=><option key={c.chain} value={c.chain}>{c.display}</option>)}</select></div>
        <div className="arb-table-scroll"><table><thead><tr><th>BUY / NETWORK</th><th>SELL / NETWORK</th><th>BUY PRICE</th><th>SELL PRICE</th><th>GROSS SPREAD</th><th>HYP. NET</th><th>STATUS</th></tr></thead><tbody>
          {opportunities.map((o, i) => <tr key={o.buy.pairAddress+o.sell.pairAddress+i}><td><strong>{o.buy.chain}</strong><small>{o.buy.dexId} <a href={o.buy.url} target="_blank" rel="noopener noreferrer" aria-label="Inspect buy pool"><ExternalLink size={11}/></a></small></td><td><strong>{o.sell.chain}</strong><small>{o.sell.dexId} <a href={o.sell.url} target="_blank" rel="noopener noreferrer" aria-label="Inspect sell pool"><ExternalLink size={11}/></a></small></td><td>{usd(o.buy.price,6)}</td><td>{usd(o.sell.price,6)}</td><td className="arb-green"><ArrowUpRight size={13}/>{pct(o.spreadPct)}</td><td className={(estimate(o.spreadPct) ?? -1) >= 0 ? 'arb-green' : 'arb-muted'}>{estimate(o.spreadPct) === null ? '—' : usd(estimate(o.spreadPct)!)}</td><td><span className="arb-pill">UNQUOTED</span></td></tr>)}
          {!loading && !opportunities.length && <tr><td colSpan={7} className="arb-empty">No comparable cross-chain pools passed the identity, price and liquidity checks. Adjust the liquidity floor or inspect feed status.</td></tr>}
          {loading && <tr><td colSpan={7} className="arb-empty">Collecting pool observations from public endpoints…</td></tr>}
        </tbody></table></div>
        <div className="arb-table-foot"><span>Max 20 price comparisons · excludes same-chain routes · does not model actual executable volume</span><span><RefreshCw size={12}/> 45s polling</span></div>
      </section>
      <aside className="arb-card arb-controls"><div className="arb-card-head"><div><h2><SlidersHorizontal size={18}/> Execution assumptions</h2><p>Illustrative sensitivity, NOT trade quotes</p></div></div><div className="arb-fields">
        <label>Notional (USD)<input type="number" min="1" step="100" value={notional} onChange={e=>setNotional(e.target.value)}/></label>
        <label>Combined AMM fees (bps)<input type="number" min="0" step="1" value={feeBps} onChange={e=>setFeeBps(e.target.value)}/></label>
        <label>Estimated gas (USD)<input type="number" min="0" step="1" value={gasUsd} onChange={e=>setGasUsd(e.target.value)}/></label>
        <label>Estimated settlement cost (USD)<input type="number" min="0" step="1" value={settlementUsd} onChange={e=>setSettlementUsd(e.target.value)}/></label>
        <label>Minimum pool liquidity (USD)<input type="number" min="0" step="10000" value={minLiquidity} onChange={e=>setMinLiquidity(e.target.value)}/></label>
        {!assumptionsValid && <p className="arb-error">Enter valid nonnegative costs and a positive notional.</p>}
        <div className="arb-estimate"><span>TOP OBSERVED SPREAD — ROUGH MODEL</span><strong>{topEstimate === null ? '—' : usd(topEstimate)}</strong><small>Excludes slippage, price impact, inventory/bridge exposure, MEV, time risk, and failed fills. May greatly overstate realizable value.</small></div>
        <button disabled className="arb-disabled"><LockKeyhole size={16}/> Route verification required</button>
      </div></aside>
    </div>
    <div className="arb-secondary"><section className="arb-card"><div className="arb-card-head"><h2><BarChart3 size={18}/> Live DEX pool intelligence</h2><span className="arb-pill">READ ONLY</span></div><div className="arb-pools">{eligible.sort((a,b)=>b.liquidityUsd-a.liquidityUsd).slice(0,8).map(p=><a key={p.chain+p.pairAddress} href={p.url} target="_blank" rel="noopener noreferrer" className="arb-pool"><div><strong>{p.chain} / {p.dexId}</strong><small>{p.baseToken.symbol} / {p.quoteToken.symbol} · {p.pairAddress.slice(0,8)}…</small></div><div><strong>{usd(p.price,6)}</strong><small>Liquidity {usd(p.liquidityUsd,0)} · 24h vol {usd(p.volumeUsd,0)}</small></div><ExternalLink size={13}/></a>)}{!eligible.length&&<div className="arb-empty">No eligible pools reported.</div>}</div></section>
      <section className="arb-card"><div className="arb-card-head"><h2><GitBranch size={18}/> X3 execution readiness</h2><span className="arb-pill">FAIL CLOSED</span></div><div className="arb-readiness">{[['Asset identity','Circle native USDC addresses configured'],['Market observation','DEX Screener pools · reference prices only'],['Executable quote','Not connected'],['X3 Shield enforcement','Not connected'],['Source / destination finality','Not connected'],['Settlement receipt','Not connected']].map(([k,v],i)=><div key={k}><span>{i<2?<Activity size={15}/>:<LockKeyhole size={15}/>}</span><div><strong>{k}</strong><small>{v}</small></div><b className={i<2?'arb-pending':'arb-off'}>{i<2?'DATA':'BLOCKED'}</b></div>)}</div></section></div>
    <IndicativeQuotePanel />
    <div className="arb-footnote"><Zap size={14}/> Price observations are not executable bids/asks. Spreads can vanish before settlement. <ArrowDownRight size={13}/> Trade actions will only unlock after on-chain route validation, policy authorization and proof-backed settlement.</div>
    {error && <div className="arb-error-box">Data feed warning: {error}. Available data may be incomplete; do not use it for trading decisions.</div>}
  </div>
}
