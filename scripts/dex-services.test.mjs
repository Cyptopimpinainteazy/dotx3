import test from 'node:test';
import assert from 'node:assert/strict';
import {optionalService} from '../src/lib/dex/optional-services.mjs';
const valid='chain=84532&hash=0x'+'0'.repeat(64);
test('rejects duplicate or extra testnet filters before RPC',async()=>{
 for(const query of [valid+'&chain=84532',valid+'&rpc=https://example.com','chain=84532']) {
  const r=await optionalService('crosscheck',new URLSearchParams(query),{check:()=>assert.fail('must not call RPC')});
  assert.equal(r.status,400);assert.equal(r.body.executionAllowed,false);
 }
});
test('testnet checker rejects mainnet and malformed hashes',async()=>{
 for(const query of ['chain=1&hash=0x'+'0'.repeat(64),'chain=84532&hash=bad']) {
  const r=await optionalService('crosscheck',new URLSearchParams(query));assert.equal(r.status,400);
 }
});
test('valid request reaches real checker but missing provider pair fails closed',async()=>{
 const r=await optionalService('crosscheck',new URLSearchParams(valid));
 assert.equal(r.status,503);assert.equal(r.body.error,'TWO_DISTINCT_RPC_PROVIDERS_REQUIRED');assert.equal(r.body.finalityVerified,false);
});
test('indicative request rejects duplicates and invalid tokens',async()=>{
 for(const query of ['chainId=8453&chainId=1&buyToken=x&sellToken=y&sellAmount=1','chainId=8453&buyToken=x&sellToken=y&sellAmount=1']){
  const r=await optionalService('indicative',new URLSearchParams(query));assert.equal(r.status,400);assert.equal(r.body.executable,false);
 }
});
test('unknown optional service does not impersonate a configured integration',async()=>{
 assert.equal(await optionalService('missing',new URLSearchParams()),null);
});
