import { useState } from 'react'
import { LockKeyhole, RefreshCw, ShieldAlert } from 'lucide-react'
const assets: Record<string,{ USDC:string; WETH:string }> = {
 '8453': {USDC:'0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',WETH:'0x4200000000000000000000000000000000000006'},
 '1': {USDC:'0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',WETH:'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'},
}
type Price = {kind:'indicative';provider:string;chainId:string;sellAmount:string;buyAmount:string;observedAt:number;expiresAt:number;executable:false}
export default function IndicativeQuotePanel() {
 const [chain,setChain]=useState('8453')
 const [side,setSide]=useState<'USDC'|'WETH'>('USDC')
 const [amount,setAmount]=useState('100')
 const [price,setPrice]=useState<Price|null>(null)
 const [error,setError]=useState('')
 const [loading,setLoading]=useState(false)
 const buy=side==='USDC'?'WETH':'USDC'
 const decimals=side==='USDC'?6:18
 const outputDecimals=side==='USDC'?18:6
 const valid=/^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(amount)&&Number(amount)>0&&(amount.split('.')[1] ?? '').length<=decimals && amount.length<=30
 const atomicAmount=()=>{const [major,minor='']=amount.split('.');return (BigInt(major)*10n**BigInt(decimals)+BigInt(minor.padEnd(decimals,'0'))).toString()}
 const request=async()=>{
  setPrice(null);setError('')
  if(!valid){setError('Enter a positive amount with valid token precision.');return}
  setLoading(true)
  try{
   const params=new URLSearchParams({chainId:chain,sellToken:assets[chain][side],buyToken:assets[chain][buy],sellAmount:atomicAmount()})
   const response=await fetch('/api/x3dex/indicative?'+params.toString())
   const result=await response.json()
   if(!response.ok)throw new Error(result.error==='QUOTE_PROVIDER_NOT_CONFIGURED'?'Server-side 0x API key not configured.':result.error??'Provider unavailable')
   if(result.executable!==false||result.kind!=='indicative')throw new Error('Unexpected quote classification')
   setPrice(result)
  }catch(e){setError(e instanceof Error?e.message:'Price unavailable')}
  finally{setLoading(false)}
 }
 const display=(quantity:string,precision:number)=>{
  const n=BigInt(quantity),scale=10n**BigInt(precision)
  return (n/scale).toString()+'.'+(n%scale).toString().padStart(precision,'0').slice(0,8)
 }
 return <section className="arb-card" style={{marginTop:16}}>
  <div className="arb-card-head"><div><h2><RefreshCw size={18}/> Indicative 0x Route Price</h2><p>Real provider integration when configured · on-chain execution unavailable</p></div><span className="arb-pill">READ ONLY</span></div>
  <div className="arb-fields" style={{display:'flex',flexWrap:'wrap',gap:14,alignItems:'end'}}>
   <label>Chain<select value={chain} onChange={e=>{setChain(e.target.value);setPrice(null)}}><option value="8453">Base</option><option value="1">Ethereum</option></select></label>
   <label>Sell token<select value={side} onChange={e=>{setSide(e.target.value as 'USDC'|'WETH');setPrice(null)}}><option>USDC</option><option>WETH</option></select></label>
   <label>Amount<input value={amount} onChange={e=>{setAmount(e.target.value);setPrice(null)}} placeholder="100" inputMode="decimal"/></label>
   <button type="button" onClick={request} disabled={loading||!valid} className="wallet-button">{loading?'Fetching…':'Request indicative price'}</button>
  </div>
  <div style={{padding:'0 18px 20px',fontSize:12,color:'#8ca5bc'}}>
   {price&&<div className="arb-estimate"><span>0x INDICATIVE OUTPUT (NOT AN EXECUTABLE QUOTE)</span><strong>{display(price.buyAmount,outputDecimals)} {buy}</strong><small>Observed {new Date(price.observedAt).toLocaleTimeString()} · expires {new Date(price.expiresAt).toLocaleTimeString()} · excludes execution authorization and finality.</small></div>}
   {error&&<p className="arb-error"><ShieldAlert size={14}/> {error}</p>}
   <p><LockKeyhole size={13}/> Requires server-side ZERO_EX_API_KEY. No signatures, allowances, transactions, or cross-chain settlement are created here.</p>
  </div>
 </section>
}
