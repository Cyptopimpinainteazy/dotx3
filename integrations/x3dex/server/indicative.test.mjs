import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ALLOWED, parseIndicativeRequest, normalizePrice, getIndicativePrice } from './indicative.mjs'
const input = new URLSearchParams({chainId:'8453',sellToken:ALLOWED['8453'].USDC,buyToken:ALLOWED['8453'].WETH,sellAmount:'100000000'})
const payload = {liquidityAvailable:true,buyAmount:'35000000000000000',sellAmount:'100000000',chainId:8453}
const fetcher=async()=>({ok:true,headers:{get:()=>null},text:async()=>JSON.stringify(payload)})
test('accepts exact allowlisted pair and bigint atomic amount',()=>assert.equal(parseIndicativeRequest(input).sellAmount,'100000000'))
test('blocks unknown chain and noncanonical asset',()=>{
 assert.throws(()=>parseIndicativeRequest(new URLSearchParams({...Object.fromEntries(input),chainId:'56'})),/Unsupported chain/)
 assert.throws(()=>parseIndicativeRequest(new URLSearchParams({...Object.fromEntries(input),buyToken:'0x0000000000000000000000000000000000000001'})),/Unsupported token pair/)
})
test('blocks duplicate/extra params and scientific notation',()=>{
 const p=new URLSearchParams(input);p.append('chainId','1');assert.throws(()=>parseIndicativeRequest(p))
 const q=new URLSearchParams(input);q.set('sellAmount','1e8');assert.throws(()=>parseIndicativeRequest(q))
})
test('rejects fake liquidity and altered amount',()=>{
 assert.throws(()=>normalizePrice({...payload,liquidityAvailable:false},parseIndicativeRequest(input),1000))
 assert.throws(()=>normalizePrice({...payload,sellAmount:'100'},parseIndicativeRequest(input),1000))
 assert.throws(()=>normalizePrice({...payload,chainId:1},parseIndicativeRequest(input),1000))
})
test('does not make request without configured API key',async()=>{
 let called=0
 const result=await getIndicativePrice(input,{apiKey:'',fetcher:async()=>{called++;return fetcher()}})
 assert.equal(result.status,503);assert.equal(called,0)
})
test('validates server-side API key headers and strips provider transaction data',async()=>{
 let request
 const result=await getIndicativePrice(input,{apiKey:'test-only',clock:()=>1000,fetcher:async(url,options)=>{request={url,options};return {ok:true,headers:{get:()=>null},text:async()=>JSON.stringify({...payload,transaction:{to:'evil',data:'0xdead'}})}}})
 assert.equal(result.status,200);assert.equal(result.body.executable,false);assert.equal(result.body.buyAmount,payload.buyAmount)
 assert.equal('transaction' in result.body,false)
 assert.equal(request.options.headers['0x-version'],'v2')
 assert.equal(request.options.headers['0x-api-key'],'test-only')
 assert.ok(request.url.startsWith('https://api.0x.org/swap/allowance-holder/price?'))
})
test('rejects invalid provider payload',async()=>{
 const r=await getIndicativePrice(input,{apiKey:'test-only',fetcher:async()=>({ok:true,headers:{get:()=>null},text:async()=>'{broken'})})
 assert.equal(r.status,503);assert.equal(r.body.execution,false)
})
