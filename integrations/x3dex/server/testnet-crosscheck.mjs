import { createHash } from 'node:crypto'

const NETWORKS = Object.freeze({ '84532':'0x14a34', '11155111':'0xaa36a7' })
const HASH=/^0x[0-9a-fA-F]{64}$/
const ADDRESS=/^0x[0-9a-fA-F]{40}$/
const QUANTITY=/^0x(?:0|[1-9a-fA-F][0-9a-fA-F]*)$/
const BLOCKED = (status,error) => ({status,body:{error,finalityVerified:false,executionAllowed:false}})
function selectedEndpoints(){
 return {
  '84532':[process.env.X3_BASE_SEPOLIA_RPC_A,process.env.X3_BASE_SEPOLIA_RPC_B],
  '11155111':[process.env.X3_SEPOLIA_RPC_A,process.env.X3_SEPOLIA_RPC_B],
 }
}
function validateEndpoints(endpoints){
 if(!Array.isArray(endpoints)||endpoints.length!==2||endpoints.some(x=>typeof x!=='string'))return false
 try{
  const pair=endpoints.map(raw=>new URL(raw))
  return pair.every(u=>u.protocol==='https:' && !u.username && !u.password && !!u.hostname && !u.hash) &&
   pair[0].hostname.toLowerCase()!==pair[1].hostname.toLowerCase()
 }catch{return false}
}
function bigint(value){
 if(typeof value!=='string'||value.length>68||!QUANTITY.test(value))throw new Error('Invalid RPC quantity')
 return BigInt(value)
}
function exactHash(value){return typeof value==='string'&&HASH.test(value)}
function same(a,b){return typeof a==='string'&&typeof b==='string'&&a.toLowerCase()===b.toLowerCase()}
async function jsonRpc(url,method,params,fetcher){
 const payload={jsonrpc:'2.0',id:1,method,params}
 const response=await fetcher(url,{method:'POST',
  headers:{'content-type':'application/json','accept':'application/json'},
  signal:AbortSignal.timeout(5500),body:JSON.stringify(payload)})
 if(!response.ok)throw new Error('RPC unavailable')
 const contentSize=Number(response.headers?.get?.('content-length')||0)
 if(contentSize>250000)throw new Error('RPC response too large')
 const body=await response.text()
 if(body.length>250000)throw new Error('RPC response too large')
 const parsed=JSON.parse(body)
 if(!parsed||parsed.jsonrpc!=='2.0'||parsed.id!==1||parsed.error||
   !Object.prototype.hasOwnProperty.call(parsed,'result'))throw new Error('Invalid RPC response')
 return parsed.result
}
class Mismatch extends Error {}
async function inspect(endpoint,network,hash,fetcher){
 const rpc=(method,params=[])=>jsonRpc(endpoint,method,params,fetcher)
 if(!same(await rpc('eth_chainId'),NETWORKS[network]))throw new Mismatch('Chain ID disagreement')
 const receipt=await rpc('eth_getTransactionReceipt',[hash])
 if(receipt===null)return null
 if(!receipt||typeof receipt!=='object')throw new Mismatch('Invalid receipt')
 if(!same(receipt.transactionHash,hash)||!exactHash(receipt.blockHash)||!QUANTITY.test(receipt.blockNumber||''))
   throw new Mismatch('Receipt identity mismatch')
 if(receipt.status!=='0x1'&&receipt.status!=='0x0')throw new Mismatch('Invalid execution status')
 const tx=await rpc('eth_getTransactionByHash',[hash])
 if(!tx||typeof tx!=='object'||!same(tx.hash,hash)||!same(tx.blockHash,receipt.blockHash)||
   (!QUANTITY.test(tx.blockNumber||'')||bigint(tx.blockNumber)!==bigint(receipt.blockNumber))||
   !ADDRESS.test(tx.from||'')||!same(tx.to,tx.from)||!same(receipt.from,tx.from)||
   !same(receipt.to,tx.to)||bigint(tx.value)!==0n||tx.input!=='0x'||bigint(tx.gas)!==21000n)
   throw new Mismatch('Transaction mismatch')
 const block=await rpc('eth_getBlockByNumber',[receipt.blockNumber,false])
 if(!block||!same(block.hash,receipt.blockHash)||bigint(block.number)!==bigint(receipt.blockNumber))
   throw new Mismatch('Block identity mismatch')
 const head=bigint(await rpc('eth_blockNumber'))
 const height=bigint(receipt.blockNumber)
 if(head<height)throw new Mismatch('Block beyond current head')
 return {
  transactionHash:hash.toLowerCase(),blockHash:receipt.blockHash.toLowerCase(),
  blockNumber:height.toString(),from:tx.from.toLowerCase(),status:receipt.status,
  confirmations:head-height+1n,
 }
}
export async function crosscheck({chain,hash},{endpoints=selectedEndpoints(),fetcher=fetch}={}){
 if(!Object.hasOwn(NETWORKS,chain)||!exactHash(hash))
   return BLOCKED(400,'INVALID_TESTNET_REQUEST')
 const pair=endpoints[chain]
 if(!validateEndpoints(pair))return BLOCKED(503,'TWO_DISTINCT_RPC_PROVIDERS_REQUIRED')
 try{
  const results=await Promise.all(pair.map(url=>inspect(url,chain,hash,fetcher)))
  if(results.some(r=>r===null))return {status:202,body:{
    status:'pending',finalityVerified:false,executionAllowed:false}}
  const [a,b]=results
  const fields=['transactionHash','blockHash','blockNumber','from','status']
  if(fields.some(k=>a[k]!==b[k]))return BLOCKED(409,'RPC_DISAGREEMENT')
  const confirmations=a.confirmations<b.confirmations?a.confirmations:b.confirmations
  const evidence={chainId:chain,transactionHash:a.transactionHash,blockHash:a.blockHash,
   blockNumber:a.blockNumber,from:a.from,receiptStatus:a.status}
  return {status:200,body:{
    status:a.status==='0x1'?'corroborated-inclusion':'corroborated-revert',
    ...evidence,confirmations:Number(confirmations),
    observationDigest:'sha256:'+createHash('sha256').update(JSON.stringify(evidence)).digest('hex'),
    providers:2,finalityVerified:false,executionAllowed:false,
  }}
 }catch(error){
  return error instanceof Mismatch?BLOCKED(409,'RPC_DISAGREEMENT'):BLOCKED(503,'RPC_UNAVAILABLE')
 }
}
