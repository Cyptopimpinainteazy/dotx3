import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { createMarketService, readJson } from './markets.mjs'
import { getIndicativePrice } from './indicative.mjs'
import { crosscheck } from './testnet-crosscheck.mjs'
const app = createMarketService()
const root = resolve(import.meta.dirname, '../../../public/dex-terminal')
const types = { '.html': 'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.ico':'image/x-icon' }
function json(res, code, value) { res.writeHead(code, {'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(value)) }
export async function handler(req,res) {
  if (req.method !== 'GET') return json(res,405,{error:'Method not allowed'})
  const url = new URL(req.url || '/', 'http://localhost')
  if (url.pathname === '/api/health') return json(res,200,{status:'ok',service:'x3dex-market-data',execution:false})
  if (['/api/dex/markets', '/api/x3dex/markets'].includes(url.pathname)) return json(res,200,await app.get())
  if (['/api/testnet/crosscheck', '/api/x3dex/crosscheck'].includes(url.pathname)) {
    const keys=[...url.searchParams.keys()]
    if(keys.length!==2 || new Set(keys).size!==2 || keys.some(key=>!['chain','hash'].includes(key)))
      return json(res,400,{error:'INVALID_TESTNET_REQUEST',finalityVerified:false,executionAllowed:false})
    const report=await crosscheck({chain:url.searchParams.get('chain'),hash:url.searchParams.get('hash')})
    return json(res,report.status,report.body)
  }

  if (['/api/quotes/indicative', '/api/x3dex/indicative'].includes(url.pathname)) {
    try { const result = await getIndicativePrice(url.searchParams); return json(res,result.status,result.body) }
    catch { return json(res,400,{error:'INVALID_QUOTE_REQUEST',execution:false}) }
  }
  if (['/api/market/ohlc', '/api/x3dex/ohlc'].includes(url.pathname)) {
    const pair = url.searchParams.get('pair')
    const interval = url.searchParams.get('interval')
    if (!['XBTUSD','ETHUSD','SOLUSD','AVAXUSD'].includes(pair) ||
        !['1','5','15','60','240','1440'].includes(interval)) return json(res,400,{error:'Unsupported pair or interval'})
    try {
      const data = await readJson('https://api.kraken.com/0/public/OHLC?pair=' + pair + '&interval=' + interval)
      if (!data || !Array.isArray(data.error) || data.error.length || typeof data.result !== 'object')
        return json(res,502,{error:'Market provider rejected request'})
      return json(res,200,data)
    } catch { return json(res,503,{error:'Market feed unavailable'}) }
  }
  if (url.pathname.startsWith('/api/')) return json(res,404,{error:'Unknown read-only endpoint'})
  // Reject traversal and serve only published frontend assets.
  const pathname = decodeURIComponent(url.pathname.replace(/^\/dex-terminal(?=\/|$)/, '') || '/')
  if (pathname.includes('\\') || pathname.includes('..') || pathname.includes('\0')) return json(res,400,{error:'Invalid path'})
  const file = resolve(root, '.' + pathname)
  if (file !== root && !file.startsWith(root + sep)) return json(res,403,{error:'Forbidden'})
  try {
    const info = await stat(file)
    if (info.isDirectory()) throw new Error('directory')
    const contents = await readFile(file)
    res.writeHead(200, {'content-type': types[extname(file)] || 'application/octet-stream', 'x-content-type-options':'nosniff'})
    res.end(contents)
  } catch {
    if (extname(pathname)) return json(res,404,{error:'Not found'})
    try { res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(await readFile(resolve(root,'index.html'))) }
    catch { json(res,503,{error:'Build terminal assets first'}) }
  }
}
if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
 const port = Number(process.env.PORT || 18971)
 if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port')
 createServer((req,res) => { handler(req,res).catch(() => json(res,500,{error:'Server unavailable'})) }).listen(port, process.env.HOST || '127.0.0.1', () => console.log('X3 DEX read-only market server listening on port ' + port))
}
