import { useEffect, useState } from 'react'
import { createObservationPass, formatObservationSummary, type CorroboratedObservation } from './proofPass'
import { CheckCircle2, CircleAlert, ExternalLink, LockKeyhole, RefreshCw, ShieldCheck } from 'lucide-react'
import { observe, prepare, submit, TESTNETS, type Prepared, type Provider, type ReceiptObservation, type TestChain } from './transaction'
import './TestnetLab.css'
type Corroboration = {
  status?: string; error?: string; confirmations?: number;
  blockNumber?: string; blockHash?: string; observationDigest?: string;
  chainId?: string; transactionHash?: string; from?: string; receiptStatus?: string; providers?: number;
  finalityVerified: false; executionAllowed: false
}
function eth(wei:string) {
 const v=BigInt(wei),base=10n**18n
 return (v/base).toString()+'.'+(v%base).toString().padStart(18,'0').slice(0,9)
}
export default function TestnetLab(){
 const [chain,setChain]=useState<TestChain>('0x14a34')
 const [prepared,setPrepared]=useState<Prepared|null>(null)
 const [armed,setArmed]=useState(false)
 const [hash,setHash]=useState<string|null>(null)
 const [sender,setSender]=useState('')
 const [receipt,setReceipt]=useState<ReceiptObservation|null>(null)
 const [error,setError]=useState('')
 const [busy,setBusy]=useState(false)
 const [checking,setChecking]=useState(false)
 const [crosschecking,setCrosschecking]=useState(false)
 const [corroboration,setCorroboration]=useState<Corroboration|null>(null)
 const [copyResult,setCopyResult]=useState('')
 const provider=typeof window==='undefined'?undefined:window.ethereum as Provider|undefined
 async function preflight(){
  if(busy||checking||crosschecking)return
  setError('');setPrepared(null);setArmed(false);setHash(null);setReceipt(null);setCorroboration(null);setCopyResult('')
  if(!provider){setError('An EIP-1193 wallet extension is required.');return}
  setBusy(true)
  try{setPrepared(await prepare(provider,chain))}
  catch(e){setError(e instanceof Error?e.message:'Unable to prepare')}
  finally{setBusy(false)}
 }
 async function send(){
  if(!provider||!prepared||!armed||busy||prepared.chain!==chain)return
  setBusy(true);setArmed(false);setError('')
  try{
   const result=await submit(provider,prepared)
   setHash(result);setSender(prepared.account);setReceipt({status:'pending',finalityVerified:false});setCorroboration(null)
  }catch(e){setError(e instanceof Error?e.message:'Wallet rejected transaction')}
  finally{setBusy(false);setPrepared(null)}
 }
 useEffect(()=>{
  if(!provider||!hash||!sender)return
  let cancelled=false
  const poll=async()=>{
   try{
    const current=await observe(provider,chain,sender,hash)
    if(!cancelled){setReceipt(current);setError('')}
   }catch(e){if(!cancelled){setError(e instanceof Error?e.message:'Receipt check failed');setReceipt(null)}}
  }
  void poll()
  const timer=window.setInterval(()=>void poll(),15000)
  return()=>{cancelled=true;window.clearInterval(timer)}
 },[provider,hash,sender,chain])
 async function refresh(){
  if(!provider||!hash||!sender)return
  setChecking(true)
  try{setReceipt(await observe(provider,chain,sender,hash));setError('')}
  catch(e){setReceipt(null);setError(e instanceof Error?e.message:'Receipt check failed')}
  finally{setChecking(false)}
 }
 async function crosscheckRpc(){
   if(!hash || crosschecking)return
   setCrosschecking(true)
   setCopyResult('')
   setCorroboration(null)
   try{
     const params=new URLSearchParams({chain:chain==='0x14a34'?'84532':'11155111',hash})
     const response=await fetch('/api/x3dex/crosscheck?'+params.toString())
     const result=await response.json() as Corroboration
     setCorroboration(result)
   }catch{
     setCorroboration({error:'RPC_CHECK_UNAVAILABLE',finalityVerified:false,executionAllowed:false})
   }finally{setCrosschecking(false)}
 }
 let observationPass:ReturnType<typeof createObservationPass>|null=null
 try {
   if(corroboration) observationPass=createObservationPass(corroboration as CorroboratedObservation)
 } catch { /* Evidence not sufficient: suppress export rather than claiming proof. */ }
 async function copyObservation(){
   if(!observationPass)return
   try{await navigator.clipboard.writeText(formatObservationSummary(observationPass));setCopyResult('Copied testnet observation summary')}
   catch{setCopyResult('Clipboard unavailable; use the JSON export instead')}
 }
 function downloadObservation(){
   if(!observationPass)return
   const blob=new Blob([JSON.stringify(observationPass,null,2)],{type:'application/json'})
   const url=URL.createObjectURL(blob)
   const link=document.createElement('a')
   link.href=url;link.download='x3-testnet-observation-'+observationPass.transactionHash.slice(2,12)+'.json'
   document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url)
 }
 function changeChain(next:TestChain){
  if(busy||checking||crosschecking)return
  setChain(next);setPrepared(null);setHash(null);setReceipt(null);setArmed(false);setError('');setCorroboration(null);setCopyResult('')
 }
 return <div className="lab">
  <div className="lab-heading"><div><span className="eyebrow">X3 DEX / EXECUTION ENGINEERING</span><h1>Testnet transaction lab</h1><p>Real user-approved wallet signing and transaction observation, without custody or token swapping.</p></div><span className="lab-tag"><ShieldCheck size={14}/> TESTNET ONLY</span></div>
  <div className="lab-banner"><CircleAlert size={18}/><span>Zero-value self-transfer only. This consumes testnet gas, requires your wallet's confirmation, and does not establish X3 Shield enforcement, cross-chain settlement, or independently verified finality.</span></div>
  <div className="lab-layout"><section className="card lab-card"><div className="card-head"><h2>1. Prepare a transaction</h2><span className="neutral-pill">PRE-FLIGHT</span></div><div className="lab-content">
   <label className="lab-label">Test network<select disabled={busy||checking||crosschecking} value={chain} onChange={e=>changeChain(e.target.value as TestChain)}><option value="0x14a34">Base Sepolia</option><option value="0xaa36a7">Ethereum Sepolia</option></select></label>
   <div className="lab-details">
    <div><span>Sender</span><strong>{prepared?.account??'Connect EVM wallet above'}</strong></div>
    <div><span>Recipient</span><strong>{prepared?'Same wallet (self-transfer)':'—'}</strong></div>
    <div><span>Value</span><strong>0 test ETH</strong></div>
    <div><span>Gas limit</span><strong>21,000</strong></div>
    <div><span>Estimated gas cost</span><strong>{prepared?eth(prepared.estimateWei)+' test ETH':'Pending preflight'}</strong></div>
   </div>
   <button className="lab-button" onClick={preflight} disabled={busy||checking||crosschecking}><RefreshCw size={15}/>{busy?'Checking wallet…':'Check network, balance & gas'}</button>
   {prepared&&prepared.chain===chain&&<div className="lab-approval">
    <label><input type="checkbox" checked={armed} onChange={e=>setArmed(e.target.checked)}/> I authorize requesting a zero-value self-transfer on {TESTNETS[chain].name}. My wallet will ask me to confirm gas expenditure.</label>
    <button className="lab-button lab-sign" disabled={!armed||busy||prepared.chain!==chain} onClick={send}><ShieldCheck size={16}/> Request testnet wallet signature</button>
   </div>}
   {error&&<p role="alert" className="lab-error"><CircleAlert size={15}/>{error}</p>}
  </div></section>
  <section className="card lab-card"><div className="card-head"><h2>2. Observe actual receipt</h2><span className="neutral-pill">RPC OBSERVATION</span></div><div className="lab-content">
   <div className="lab-details"><div><span>Transaction hash</span><strong>{hash?<a href={TESTNETS[chain].explorer+hash} target="_blank" rel="noopener noreferrer">{hash.slice(0,12)}…{hash.slice(-8)} <ExternalLink size={12}/></a>:'No transaction submitted'}</strong></div>
   <div><span>Observed status</span><strong>{receipt?.status??'Not available'}</strong></div>
   <div><span>RPC confirmations</span><strong>{receipt?.status==='included'||receipt?.status==='reverted'?receipt.confirmations:'—'}</strong></div>
   <div><span>Receipt block</span><strong>{receipt?.status==='included'||receipt?.status==='reverted'?receipt.blockNumber:'—'}</strong></div>
   <div><span>Independent finality</span><strong className="lab-blocked">NOT VERIFIED</strong></div></div>
   <button className="lab-button" onClick={refresh} disabled={!hash||checking}><RefreshCw size={15}/>{checking?'Checking…':'Refresh receipt now'}</button>
   <p className="lab-note">{receipt?.status==='included'?<CheckCircle2 size={15}/>:<LockKeyhole size={15}/>} A matching receipt is proof of wallet-RPC observation only. Chain-independent finality and settlement proof validation remain blocked. Receipt checks automatically repeat every 15 seconds while this page is open.</p>
  </div></section></div>
  <div className="lab-next">
   <h2>3. Cross-check against two configured RPC providers</h2>
   <p>Compares transaction, receipt, block hash, chain identity and confirmations across two separate RPC hostnames. Both must agree. This is corroboration, not cryptographic consensus finality.</p>
   <button className="lab-button" disabled={!hash || crosschecking} onClick={crosscheckRpc}>
    <RefreshCw size={15}/>{crosschecking?'Checking two RPCs…':'Cross-check transaction'}
   </button>
   {corroboration && <div className="lab-details">
    <div><span>Result</span><strong>{corroboration.status??corroboration.error??'Unavailable'}</strong></div>
    <div><span>Minimum confirmations</span><strong>{corroboration.confirmations??'—'}</strong></div>
    <div><span>Observation digest</span><strong>{corroboration.observationDigest??'Not available'}</strong></div>
    <div><span>Consensus finality</span><strong className="lab-blocked">NOT VERIFIED</strong></div>
   </div>}
   <div className="lab-approval">
     <h2>X3 Proof Pass · Testnet observation</h2>
     <p className="lab-note">Export and share a two-RPC observation only when both sources agree. This is NOT independent consensus finality, verified settlement, an executed swap, or evidence of savings.</p>
     <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
       <button className="lab-button" style={{flex:'1 1 180px'}} disabled={!observationPass} onClick={copyObservation}>Copy observation summary</button>
       <button className="lab-button" style={{flex:'1 1 180px'}} disabled={!observationPass} onClick={downloadObservation}>Export observation JSON</button>
     </div>
     {copyResult && <p role="status" className="lab-note">{copyResult}</p>}
   </div>
  </div>
  <div className="lab-next"><h2>4. Required before actual swaps</h2><p>Real executable route → calldata and allowance verification → mandatory X3 Shield enforcement → independent source finality → destination settlement → balance reconciliation → verified receipt. None of these steps are unlocked by a successful wallet self-transfer.</p></div>
 </div>
}
