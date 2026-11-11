/** Read-only, fail-closed assessment of externally supplied executable quotes. */
export type Chain = 'eip155:1'|'eip155:8453'|'solana:mainnet'|'near:mainnet'
export type Asset = { chain: Chain; address: string; decimals: number }
export type Quote = { id:string; provider:string; venue:string; input:Asset; output:Asset; amountIn:string; amountOut:string; minOut:string; observedAt:number; expiresAt:number; executable:boolean }
export type Plan = { buy:Quote; sell:Quote; shieldAuthorized:boolean; settlementVerified:boolean; preFunded:boolean }
const integer=/^(0|[1-9][0-9]*)$/
export function atomic(s:string):bigint|null {if(typeof s!=='string'||s.length>90||!integer.test(s))return null;try{return BigInt(s)}catch{return null}}
export function validAsset(a:Asset):boolean {
 if(!a||!Number.isInteger(a.decimals)||a.decimals<0||a.decimals>30||typeof a.address!=='string')return false
 if(a.chain==='eip155:1'||a.chain==='eip155:8453')return /^0x[0-9a-fA-F]{40}$/.test(a.address)
 if(a.chain==='solana:mainnet')return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(a.address)
 if(a.chain==='near:mainnet')return /^(?=.{2,64}$)[a-z0-9_-]+(?:\.[a-z0-9_-]+)*$/.test(a.address)
 return false
}
export function sameAsset(a:Asset,b:Asset):boolean {return validAsset(a)&&validAsset(b)&&a.chain===b.chain&&a.decimals===b.decimals&&(a.chain.startsWith('eip155:')?a.address.toLowerCase()===b.address.toLowerCase():a.address===b.address)}
export function validateQuote(q:Quote,now:number):string[] {
 const errors:string[]=[]
 if(!q||!validAsset(q.input)||!validAsset(q.output))errors.push('invalid-asset')
 if(!q?.id||!q.provider||!q.venue)errors.push('missing-provider')
 if(!q?.executable)errors.push('not-executable')
 const values=[q?.amountIn,q?.amountOut,q?.minOut].map(atomic)
 if(values.some(v=>v===null||v===0n))errors.push('invalid-amount')
 else if(values[2]!>values[1]!)errors.push('minimum-exceeds-quote')
 if(!Number.isSafeInteger(now)||!Number.isSafeInteger(q?.observedAt)||!Number.isSafeInteger(q?.expiresAt))errors.push('invalid-time')
 else {
  if(q.observedAt>now+2000)errors.push('future-observation')
  if(now-q.observedAt>15000)errors.push('stale')
  if(q.expiresAt<=now||q.expiresAt<=q.observedAt||q.expiresAt-q.observedAt>120000)errors.push('expired')
 }
 return errors
}
export type Assessment={valid:false;errors:string[]}|{valid:true;grossSpreadBps:bigint;netKnown:false;executionAllowed:false}
export function assessPlan(p:Plan,now:number):Assessment {
 const errors=[...validateQuote(p.buy,now),...validateQuote(p.sell,now)]
 if(!sameAsset(p.buy.output,p.sell.input)||!sameAsset(p.buy.input,p.sell.output))errors.push('incompatible-asset')
 if(!p.shieldAuthorized)errors.push('shield-not-authorized')
 if(!p.settlementVerified||!p.preFunded)errors.push('settlement-unverified')
 if(errors.length)return {valid:false,errors:[...new Set(errors)]}
 if(atomic(p.buy.minOut)!<atomic(p.sell.amountIn)!)return {valid:false,errors:['insufficient-intermediate-output']}
 const bps=(atomic(p.sell.minOut)!-atomic(p.buy.amountIn)!)*10000n/atomic(p.buy.amountIn)!
 return {valid:true,grossSpreadBps:bps,netKnown:false,executionAllowed:false}
}
