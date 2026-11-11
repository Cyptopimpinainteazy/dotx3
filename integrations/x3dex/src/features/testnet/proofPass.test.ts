import { describe, expect, it } from 'vitest'
import { createObservationPass, formatObservationSummary } from './proofPass'

const hash = '0x' + 'a'.repeat(64)
const blockHash = '0x' + 'b'.repeat(64)
const account = '0x' + '1'.repeat(40)
const digest = 'sha256:' + 'c'.repeat(64)
const input = {
  status:'corroborated-inclusion', chainId:'84532', transactionHash:hash,
  blockHash, blockNumber:'220', from:account, receiptStatus:'0x1',
  confirmations:4, observationDigest:digest, providers:2,
  finalityVerified:false, executionAllowed:false,
}
describe('X3 Proof Pass: evidence transparency', () => {
  it('packages corroborated testnet observation without asserting consensus finality', () => {
    const pass=createObservationPass(input)
    expect(pass).toMatchObject({
      kind:'x3dex-testnet-rpc-observation',chainId:'84532',transactionHash:hash,
      verification:{rpcCorroborated:true,consensusFinalityVerified:false,settlementVerified:false},
      transaction:{type:'zero-value-self-transfer',receiptStatus:'included'},
    })
    expect(pass).not.toHaveProperty('profit')
    expect(pass).not.toHaveProperty('savings')
    expect(pass).not.toHaveProperty('executionAllowed')
  })
  it('provides a traceable explorer link while clearly disclosing limitations', () => {
    const summary=formatObservationSummary(createObservationPass(input))
    expect(summary).toContain('https://sepolia.basescan.org/tx/' + hash)
    expect(summary).toContain('NOT independently finality verified')
    expect(summary).toContain('No swap or savings claim')
  })
  it('never describes a reverted transaction as completed', () => {
    const pass=createObservationPass({...input,status:'corroborated-revert',receiptStatus:'0x0'})
    expect(pass.transaction.receiptStatus).toBe('reverted')
    expect(formatObservationSummary(pass)).toContain('REVERTED')
  })
  it('rejects forged or incomplete response metadata', () => {
    for (const variant of [
      {...input,providers:1}, {...input,finalityVerified:true},
      {...input,executionAllowed:true}, {...input,observationDigest:'garbage'},
      {...input,transactionHash:'0x123'}, {...input,blockNumber:'-1'},
      {...input,status:'pending'}, {...input,chainId:'1'},
      {...input,status:'corroborated-inclusion',receiptStatus:'0x0'},
      {...input,confirmations:0}, {...input,from:account.slice(0,-2)},
    ]) expect(() => createObservationPass(variant)).toThrow()
  })
})
