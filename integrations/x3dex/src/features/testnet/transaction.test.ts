import { describe, expect, it } from 'vitest'
import { prepare, submit, observe, type Provider } from './transaction'

const account='0x1111111111111111111111111111111111111111'
const hash='0x'+'a'.repeat(64)
const blockHash='0x'+'b'.repeat(64)
const chain='0x14a34' as const
function wallet(overrides:Record<string,unknown>={},history:string[]=[]):Provider {
  const defaults:Record<string,unknown>={
    eth_chainId:chain,eth_accounts:[account],eth_getCode:'0x',eth_estimateGas:'0x5208',
    eth_gasPrice:'0x3b9aca00',eth_getBalance:'0xde0b6b3a7640000',
    eth_sendTransaction:hash,
    eth_getTransactionReceipt:{transactionHash:hash,blockHash,blockNumber:'0x10',from:account,to:account,status:'0x1'},
    eth_getTransactionByHash:{hash,blockHash,from:account,to:account,value:'0x0',input:'0x',gas:'0x5208'},
    eth_getBlockByNumber:{hash:blockHash},eth_blockNumber:'0x13',
  }
  return {async request({method}) {history.push(method);const v=Object.prototype.hasOwnProperty.call(overrides,method)?overrides[method]:defaults[method];if(v instanceof Error)throw v;return typeof v==='function'?(v as ()=>unknown)():v}}
}
describe('testnet-only wallet smoke',()=>{
  it('prepares exactly a 0-value self transfer',async()=>expect(await prepare(wallet(),chain)).toMatchObject({account,chain,gasLimit:'0x5208'}))
  it('rejects wrong or mainnet chain before any signing',async()=>{
    const history:string[]=[]
    await expect(prepare(wallet({eth_chainId:'0x1'},history),chain)).rejects.toThrow('Select')
    expect(history).toEqual(['eth_chainId'])
  })
  it('blocks contracts and unexpected gas',async()=>{
    await expect(prepare(wallet({eth_getCode:'0x6000'}),chain)).rejects.toThrow('Contract')
    await expect(prepare(wallet({eth_estimateGas:'0x6000'}),chain)).rejects.toThrow('Unexpected gas')
  })
  it('blocks low gas balances and invalid values',async()=>{
    await expect(prepare(wallet({eth_getBalance:'0x1'}),chain)).rejects.toThrow('Insufficient')
    await expect(prepare(wallet({eth_gasPrice:'1e9'}),chain)).rejects.toThrow('Invalid provider')
  })
  it('does not send if connected account changed between preparation and submission',async()=>{
    const p=wallet();const prep=await prepare(p,chain)
    const calls:string[]=[]
    await expect(submit(wallet({eth_accounts:['0x'+'2'.repeat(40)]},calls),prep)).rejects.toThrow('account changed')
    expect(calls).not.toContain('eth_sendTransaction')
  })
  it('submits only from user-triggered method with fixed transaction parameters',async()=>{
    let sent:unknown
    const provider=wallet()
    const original=provider.request
    provider.request=async args=>{if(args.method==='eth_sendTransaction')sent=args.params;return original(args)}
    const prepared=await prepare(provider,chain)
    expect(await submit(provider,prepared)).toBe(hash)
    expect(sent).toEqual([{from:account,to:account,value:'0x0',data:'0x',gas:'0x5208'}])
  })
  it('does not claim finality for a matching included receipt',async()=>{
    expect(await observe(wallet(),chain,account,hash)).toMatchObject({status:'included',confirmations:4,finalityVerified:false})
  })
  it('handles pending receipts and reverted status distinctly',async()=>{
    expect(await observe(wallet({eth_getTransactionReceipt:null}),chain,account,hash)).toEqual({status:'pending',finalityVerified:false})
    const r=await wallet().request({method:'eth_getTransactionReceipt',params:[hash]})
    expect(await observe(wallet({eth_getTransactionReceipt:{...(r as object),status:'0x0'}}),chain,account,hash)).toMatchObject({status:'reverted',finalityVerified:false})
  })
  it('rejects mismatched transactions and changed block hash',async()=>{
    const tx=await wallet().request({method:'eth_getTransactionByHash',params:[hash]})
    await expect(observe(wallet({eth_getTransactionByHash:{...(tx as object),to:'0x'+'3'.repeat(40)}}),chain,account,hash)).rejects.toThrow('mismatch')
    await expect(observe(wallet({eth_getBlockByNumber:{hash:'0x'+'f'.repeat(64)}}),chain,account,hash)).rejects.toThrow('Block hash mismatch')
  })
})
