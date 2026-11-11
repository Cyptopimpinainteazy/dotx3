import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createMarketService, validatePool, TOKENS } from './markets.mjs'
const raw = (token) => ({
  chainId:token.chain,baseToken:{address:token.address,symbol:'USDC'},
  quoteToken:{address:'0x1111111111111111111111111111111111111111',symbol:'WETH'},
  pairAddress:'0x2222222222222222222222222222222222222222',
  dexId:'sample-venue',url:'https://dexscreener.com/base/abc',
  priceUsd:'1.00001',liquidity:{usd:150000},volume:{h24:10000}
})
const response = (body, status=200) => ({ok:status===200,status,headers:{get:()=>null},text:async()=>JSON.stringify(body)})
test('rejects fake token address even if symbol is USDC',()=>assert.equal(validatePool({...raw(TOKENS[0]),baseToken:{symbol:'USDC',address:'0x0000000000000000000000000000000000000000'}},TOKENS[0]),null))
test('rejects low liquidity and mismatched networks',()=>{assert.equal(validatePool({...raw(TOKENS[0]),liquidity:{usd:10}},TOKENS[0]),null);assert.equal(validatePool({...raw(TOKENS[0]),chainId:'base'},TOKENS[0]),null)})
test('validates pool data without pretending execution',()=>assert.equal(validatePool(raw(TOKENS[0]),TOKENS[0]).priceUsd,'1.00001'))
test('partial network outages remain marked degraded',async()=>{
 const service=createMarketService({fetcher:async url=>url.includes('/base/')?response([],503):response([raw(TOKENS.find(t=>url.includes('/'+t.chain+'/')))]),clock:()=>10000})
 const result=await service.get()
 assert.equal(result.partial,true);assert.equal(result.stale,false);assert.equal(result.executable,false);assert.equal(result.pools.length,2);assert.match(result.errors[0],/base/)
})
test('all providers unavailable yields empty stale response',async()=>{
 const service=createMarketService({fetcher:async()=>response([],403),clock:()=>20000})
 const result=await service.get()
 assert.equal(result.stale,true);assert.deepEqual(result.pools,[]);assert.equal(result.executable,false)
})
test('fresh snapshot deduplicates concurrent calls',async()=>{
 let calls=0
 const service=createMarketService({fetcher:async()=>{calls++;return response([])},clock:()=>30000})
 await Promise.all([service.get(),service.get(),service.get()])
 await service.get()
 assert.equal(calls,3)
})
test('outage after cache expiration explicitly flags stale snapshot',async()=>{
 let ok=true,clock=0
 const service=createMarketService({clock:()=>clock,fetcher:async()=>ok?response([]):response([],403)})
 assert.equal((await service.get()).stale,false)
 ok=false;clock=50000
 const state=await service.get()
 assert.equal(state.stale,true);assert.equal(state.partial,true);assert.equal(state.executable,false)
})
