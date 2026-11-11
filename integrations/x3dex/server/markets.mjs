// Production-safe read-only market-data aggregator. No quoting or trading endpoints.
const TOKENS = Object.freeze([
  { chain: 'ethereum', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
  { chain: 'base', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' },
  { chain: 'solana', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
])
export const MAX_AGE_MS = 45000
export const TIMEOUT_MS = 6500
export const MAX_BODY_BYTES = 1500000
const symbol = v => typeof v === 'string' && v.length <= 30 ? v : ''
const validNumber = v => typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null
const sameAddress = (a, b) => a.toLowerCase() === b.toLowerCase()
const expectedUrl = /^https:\/\/dexscreener\.com\//
export function validatePool(row, token) {
  if (!row || typeof row !== 'object' || row.chainId !== token.chain ||
      typeof row.baseToken?.address !== 'string' ||
      !sameAddress(row.baseToken.address, token.address) ||
      typeof row.pairAddress !== 'string' || row.pairAddress.length > 120 ||
      !row.pairAddress || typeof row.dexId !== 'string' || !row.dexId ||
      row.dexId.length > 60 || typeof row.quoteToken?.address !== 'string' ||
      typeof row.url !== 'string' || !expectedUrl.test(row.url)) return null
  const price = Number(row.priceUsd)
  const liquidityUsd = validNumber(row.liquidity?.usd)
  const volumeUsd = validNumber(row.volume?.h24)
  if (!Number.isFinite(price) || price <= 0 || liquidityUsd === null || liquidityUsd < 50000) return null
  return {
    chain: token.chain, chainId: token.chain, pairAddress: row.pairAddress,
    dexId: row.dexId, url: row.url, priceUsd: String(price),
    baseToken: { address: token.address, symbol: symbol(row.baseToken.symbol) },
    quoteToken: { address: row.quoteToken.address, symbol: symbol(row.quoteToken.symbol) },
    liquidity: { usd: liquidityUsd }, volume: { h24: volumeUsd ?? 0 },
  }
}
export async function readJson(url, fetcher = fetch, timeoutMs = TIMEOUT_MS) {
  const response = await fetcher(url, { signal: AbortSignal.timeout(timeoutMs), headers: { accept: 'application/json' } })
  if (!response.ok) throw new Error('Upstream status ' + response.status)
  const contentLength = response.headers?.get?.('content-length')
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) throw new Error('Response too large')
  const text = await response.text()
  if (text.length > MAX_BODY_BYTES) throw new Error('Response too large')
  return JSON.parse(text)
}
export function createMarketService({ fetcher = fetch, clock = Date.now } = {}) {
  let snapshot = null
  let pending = null
  async function refresh() {
    const results = await Promise.allSettled(TOKENS.map(async token => {
      const data = await readJson('https://api.dexscreener.com/tokens/v1/' + token.chain + '/' + token.address, fetcher)
      if (!Array.isArray(data)) throw new Error('Invalid response')
      return data.map(pool => validatePool(pool, token)).filter(Boolean)
    }))
    const errors = results.flatMap((r, i) => r.status === 'rejected' ? [TOKENS[i].chain + ': ' + (r.reason instanceof Error ? r.reason.message : 'upstream unavailable')] : [])
    const pools = results.flatMap(r => r.status === 'fulfilled' ? r.value : [])
    if (errors.length === TOKENS.length) throw new Error('All market sources unavailable')
    return { asOf: clock(), source: 'DEX Screener public pool data (indicative)', pools, partial: errors.length > 0, errors, executable: false }
  }
  return {
    async get() {
      const now = clock()
      if (snapshot && now - snapshot.asOf < MAX_AGE_MS) return { ...snapshot, stale: false }
      if (!pending) pending = refresh().then(result => { snapshot = result; return result }).finally(() => { pending = null })
      try { return { ...(await pending), stale: false } }
      catch (error) {
        // Stale data is explicitly labelled and never passed off as fresh.
        if (snapshot) return { ...snapshot, stale: true, partial: true, errors: [...snapshot.errors, String(error)] }
        return { asOf: null, source: 'DEX Screener public pool data (indicative)', pools: [], partial: true, stale: true, errors: [String(error)], executable: false }
      }
    },
  }
}
export { TOKENS }
