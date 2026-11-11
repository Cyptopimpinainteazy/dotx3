// 0x v2 read-only indicative quote adapter. Never returns transactions or enables signing.
export const ALLOWED = Object.freeze({
  '8453': Object.freeze({
    USDC:'0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    WETH:'0x4200000000000000000000000000000000000006',
  }),
  '1': Object.freeze({
    USDC:'0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    WETH:'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  }),
})
const MAX_AMOUNT = 10n**30n
export function parseIndicativeRequest(searchParams) {
  const keys=[...searchParams.keys()]
  if(keys.length!==4 || new Set(keys).size!==4 || keys.some(k=>!['chainId','sellToken','buyToken','sellAmount'].includes(k))) throw new Error('Unsupported request parameters')
  const chainId=searchParams.get('chainId')
  const available=ALLOWED[chainId]
  if(!available) throw new Error('Unsupported chain')
  const sellToken=searchParams.get('sellToken')
  const buyToken=searchParams.get('buyToken')
  const valid=Object.values(available).map(a=>a.toLowerCase())
  if(!sellToken||!buyToken||!valid.includes(sellToken.toLowerCase())||!valid.includes(buyToken.toLowerCase())||sellToken.toLowerCase()===buyToken.toLowerCase()) throw new Error('Unsupported token pair')
  const sellAmount=searchParams.get('sellAmount')
  if(!sellAmount||! /^[1-9][0-9]{0,29}$/.test(sellAmount)||BigInt(sellAmount)>MAX_AMOUNT) throw new Error('Invalid sellAmount atomic units')
  return {chainId,sellToken:valid.find(a=>a===sellToken.toLowerCase()),buyToken:valid.find(a=>a===buyToken.toLowerCase()),sellAmount}
}
function amount(value) {return typeof value==='string'&&/^[1-9][0-9]{0,59}$/.test(value)?value:null}
export function normalizePrice(data, request, observedAt) {
  if(!data||typeof data!=='object'||data.liquidityAvailable!==true)throw new Error('Insufficient quote liquidity')
  const buyAmount=amount(data.buyAmount)
  const sellAmount=amount(data.sellAmount)
  if(!buyAmount||!sellAmount||sellAmount!==request.sellAmount) throw new Error('Invalid quote amounts')
  if(data.chainId!=null&&String(data.chainId)!==request.chainId)throw new Error('Wrong response chain')
  if(data.buyToken&&data.buyToken.toLowerCase()!==request.buyToken)throw new Error('Wrong response buy token')
  if(data.sellToken&&data.sellToken.toLowerCase()!==request.sellToken)throw new Error('Wrong response sell token')
  return {kind:'indicative',provider:'0x Swap API v2',chainId:request.chainId,sellToken:request.sellToken,buyToken:request.buyToken,sellAmount,buyAmount,observedAt,expiresAt:observedAt+10000,liquidityAvailable:true,executable:false,shieldAuthorized:false,settlementVerified:false,feesVerified:false}
}
export async function getIndicativePrice(searchParams,{fetcher=fetch,apiKey=process.env.ZERO_EX_API_KEY,clock=Date.now}={}) {
  const request=parseIndicativeRequest(searchParams)
  if(!apiKey) return {status:503,body:{error:'QUOTE_PROVIDER_NOT_CONFIGURED',execution:false}}
  const query=new URLSearchParams(request)
  const endpoint='https://api.0x.org/swap/allowance-holder/price?'+query.toString()
  try{
    const response=await fetcher(endpoint,{headers:{'0x-api-key':apiKey,'0x-version':'v2','accept':'application/json'},signal:AbortSignal.timeout(5000)})
    if(!response.ok)return {status:503,body:{error:'QUOTE_PROVIDER_UNAVAILABLE',execution:false}}
    const size=Number(response.headers?.get?.('content-length')||0)
    if(size>150000)throw new Error('Response too large')
    const raw=await response.text()
    if(raw.length>150000)throw new Error('Response too large')
    const price=normalizePrice(JSON.parse(raw),request,clock())
    return {status:200,body:price}
  }catch{return {status:503,body:{error:'INVALID_OR_UNAVAILABLE_PRICE',execution:false}}}
}
