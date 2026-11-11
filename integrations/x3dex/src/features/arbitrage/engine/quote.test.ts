import {describe,it,expect} from 'vitest'
import {atomic,assessPlan,sameAsset,validateQuote,type Quote,type Plan} from './quote'
const now=1_800_000_000_000
const usdc={chain:'eip155:8453' as const,address:'0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',decimals:6}
const weth={chain:'eip155:8453' as const,address:'0x4200000000000000000000000000000000000006',decimals:18}
const buy:Quote={id:'q1',provider:'independent-provider',venue:'verified-venue',input:usdc,output:weth,amountIn:'100000000',amountOut:'100000000000000000',minOut:'99000000000000000',observedAt:now-1000,expiresAt:now+10000,executable:true}
const sell:Quote={...buy,id:'q2',input:weth,output:usdc,amountIn:'99000000000000000',amountOut:'101000000',minOut:'100500000'}
const plan:Plan={buy,sell,shieldAuthorized:true,settlementVerified:true,preFunded:true}
describe('fail-closed executable quote assessment',()=>{
 it('accepts precise atomic math without IEEE-754',()=>{expect(atomic('9007199254740993123')).toBe(9007199254740993123n);expect(atomic('1.5')).toBeNull();expect(atomic('1e9')).toBeNull()})
 it('refuses missing provider and fabricated execution',()=>expect(validateQuote({...buy,provider:'',executable:false},now)).toEqual(expect.arrayContaining(['missing-provider','not-executable'])))
 it('refuses stale and expired quotes',()=>{expect(validateQuote({...buy,observedAt:now-20000},now)).toContain('stale');expect(validateQuote({...buy,expiresAt:now-1},now)).toContain('expired')})
 it('refuses future and oversized timestamps',()=>{expect(validateQuote({...buy,observedAt:now+5000},now)).toContain('future-observation');expect(validateQuote({...buy,expiresAt:now+200000},now)).toContain('expired')})
 it('rejects manipulated token identity and amount',()=>{expect(validateQuote({...buy,input:{...usdc,address:'0xBAD'},amountIn:'-3'},now)).toEqual(expect.arrayContaining(['invalid-asset','invalid-amount']))})
 it('refuses a minimum output greater than a quoted output',()=>expect(validateQuote({...buy,minOut:'100000000000000001'},now)).toContain('minimum-exceeds-quote'))
 it('does not merge token identities across chains',()=>expect(sameAsset(usdc,{...usdc,chain:'eip155:1'})).toBe(false))
 it('refuses settlement or shield gaps',()=>{const r=assessPlan({...plan,shieldAuthorized:false,settlementVerified:false},now);expect(r.valid).toBe(false);if(!r.valid)expect(r.errors).toEqual(expect.arrayContaining(['shield-not-authorized','settlement-unverified']))})
 it('refuses insufficient intermediate output',()=>{const r=assessPlan({...plan,sell:{...sell,amountIn:'99000000000000001'}},now);expect(r).toMatchObject({valid:false,errors:['insufficient-intermediate-output']})})
 it('calculates only gross, NEVER claims execution permission',()=>expect(assessPlan(plan,now)).toEqual({valid:true,grossSpreadBps:50n,netKnown:false,executionAllowed:false}))
})
