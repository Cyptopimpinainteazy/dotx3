import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crosscheck } from './testnet-crosscheck.mjs'
const H='0x'+'a'.repeat(64), B='0x'+'b'.repeat(64), A='0x'+'1'.repeat(40)
const cfg={ '84532':['https://rpc-one.example','https://rpc-two.example'] }
const rpc={
 eth_chainId:'0x14a34',
 eth_getTransactionReceipt:{transactionHash:H,status:'0x1',blockHash:B,blockNumber:'0x10',from:A,to:A},
 eth_getTransactionByHash:{hash:H,blockHash:B,blockNumber:'0x10',from:A,to:A,input:'0x',value:'0x0',gas:'0x5208'},
 eth_getBlockByNumber:{hash:B,number:'0x10'},
 eth_blockNumber:'0x14'
}
const fetcher=async (url,options)=>{
 const req=JSON.parse(options.body)
 return {ok:true,headers:{get:()=>null},text:async()=>JSON.stringify({jsonrpc:'2.0',id:req.id,result:rpc[req.method]})}
}
test('rejects missing or identical RPCs without contacting endpoints',async()=>{
 let called=0
 const bad=await crosscheck({chain:'84532',hash:H}, {endpoints:{},fetcher:async()=>{called++}})
 assert.equal(bad.status,503);assert.equal(called,0);assert.equal(bad.body.finalityVerified,false)
 const duplicate=await crosscheck({chain:'84532',hash:H},{endpoints:{84532:['https://rpc-one.example','https://rpc-one.example']},fetcher})
 assert.equal(duplicate.status,503)
})
test('rejects non-testnet chain and malformed hash',async()=>{
 assert.equal((await crosscheck({chain:'1',hash:H},{endpoints:cfg,fetcher})).status,400)
 assert.equal((await crosscheck({chain:'84532',hash:'broken'},{endpoints:cfg,fetcher})).status,400)
})
test('matching independent observations corroborate inclusion but never finality',async()=>{
 const result=await crosscheck({chain:'84532',hash:H},{endpoints:cfg,fetcher})
 assert.equal(result.status,200);assert.equal(result.body.status,'corroborated-inclusion')
 assert.equal(result.body.confirmations,5)
 assert.equal(result.body.blockHash,B);assert.equal(result.body.finalityVerified,false)
 assert.equal(result.body.executionAllowed,false)
 assert.equal(JSON.stringify(result.body).includes('rpc-one'),false)
})
test('provider disagreement is blocked without claiming success',async()=>{
 const disagrees=async(url,options)=>{
   const req=JSON.parse(options.body)
   const result=url.includes('two') && req.method==='eth_getBlockByNumber'?{hash:'0x'+'c'.repeat(64),number:'0x10'}:rpc[req.method]
   return {ok:true,headers:{get:()=>null},text:async()=>JSON.stringify({jsonrpc:'2.0',id:req.id,result})}
 }
 const r=await crosscheck({chain:'84532',hash:H},{endpoints:cfg,fetcher:disagrees})
 assert.notEqual(r.status,200);assert.equal(r.body.finalityVerified,false)
})
test('pending receipt never becomes verified and one RPC outage is fail closed',async()=>{
 const pending=async(url,options)=>{const req=JSON.parse(options.body);return {ok:true,headers:{get:()=>null},text:async()=>JSON.stringify({jsonrpc:'2.0',id:req.id,result:req.method==='eth_getTransactionReceipt'?null:rpc[req.method]})}}
 const p=await crosscheck({chain:'84532',hash:H},{endpoints:cfg,fetcher:pending})
 assert.equal(p.body.status,'pending');assert.equal(p.body.finalityVerified,false)
 const outage=await crosscheck({chain:'84532',hash:H},{endpoints:cfg,fetcher:async()=>{throw new Error('unavailable')}})
 assert.equal(outage.status,503);assert.equal(outage.body.finalityVerified,false)
})
test('rejects tampered transaction and wrong chain ID',async()=>{
 const bad=async(url,options)=>{const req=JSON.parse(options.body);let result=rpc[req.method]
   if(req.method==='eth_getTransactionByHash') result={...result,to:'0x'+'2'.repeat(40)}
   return {ok:true,headers:{get:()=>null},text:async()=>JSON.stringify({jsonrpc:'2.0',id:req.id,result})}
 }
 assert.equal((await crosscheck({chain:'84532',hash:H},{endpoints:cfg,fetcher:bad})).status,409)
 const wrong=async(url,options)=>{const req=JSON.parse(options.body);return {ok:true,headers:{get:()=>null},text:async()=>JSON.stringify({jsonrpc:'2.0',id:req.id,result:req.method==='eth_chainId'?'0x1':rpc[req.method]})}}
 assert.equal((await crosscheck({chain:'84532',hash:H},{endpoints:cfg,fetcher:wrong})).status,409)
})
test('rejects transaction whose block number conflicts with its receipt',async()=>{
 const changed=async(url,options)=>{
   const req=JSON.parse(options.body)
   const result=req.method==='eth_getTransactionByHash'
     ?{...rpc[req.method],blockNumber:'0x11'}
     :rpc[req.method]
   return {ok:true,headers:{get:()=>null},text:async()=>JSON.stringify({jsonrpc:'2.0',id:req.id,result})}
 }
 const report=await crosscheck({chain:'84532',hash:H},{endpoints:cfg,fetcher:changed})
 assert.equal(report.status,409)
 assert.equal(report.body.finalityVerified,false)
})
