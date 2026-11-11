/** Export of a cross-checked testnet observation; NOT settlement or consensus-finality proof. */
const HASH = /^0x[0-9a-fA-F]{64}$/
const DIGEST = /^sha256:[0-9a-f]{64}$/
const ADDRESS = /^0x[0-9a-fA-F]{40}$/
const DECIMAL = /^(0|[1-9][0-9]*)$/
const NETWORKS = {
  '84532': {name:'Base Sepolia',explorer:'https://sepolia.basescan.org/tx/'},
  '11155111':{name:'Ethereum Sepolia',explorer:'https://sepolia.etherscan.io/tx/'},
} as const
type Network = keyof typeof NETWORKS
export type CorroboratedObservation = {
  status:string; chainId:string; transactionHash:string; blockHash:string;
  blockNumber:string; from:string; receiptStatus:string; confirmations:number;
  observationDigest:string; providers:number; finalityVerified:boolean; executionAllowed:boolean
}
export function createObservationPass(input:CorroboratedObservation) {
  if (!input || !Object.hasOwn(NETWORKS,input.chainId) ||
      !HASH.test(input.transactionHash) || !HASH.test(input.blockHash) ||
      !ADDRESS.test(input.from) || !DECIMAL.test(input.blockNumber) ||
      !Number.isSafeInteger(input.confirmations) || input.confirmations<1 ||
      input.providers!==2 || input.finalityVerified!==false ||
      input.executionAllowed!==false || !DIGEST.test(input.observationDigest) ||
      !((input.status==='corroborated-inclusion' && input.receiptStatus==='0x1') ||
        (input.status==='corroborated-revert' && input.receiptStatus==='0x0')))
    throw new Error('Only two-RPC corroborated testnet observations may be exported')
  const chain=input.chainId as Network
  return {
    schema:1 as const, kind:'x3dex-testnet-rpc-observation' as const,
    chainId:chain, network:NETWORKS[chain].name,
    transactionHash:input.transactionHash.toLowerCase(),
    sender:input.from.toLowerCase(), blockHash:input.blockHash.toLowerCase(),
    blockNumber:input.blockNumber, confirmations:input.confirmations,
    observationDigest:input.observationDigest,
    transaction:{type:'zero-value-self-transfer' as const,receiptStatus:input.receiptStatus==='0x1'?'included' as const:'reverted' as const},
    explorer:NETWORKS[chain].explorer+input.transactionHash.toLowerCase(),
    verification:{rpcCorroborated:true as const,consensusFinalityVerified:false as const,settlementVerified:false as const},
    warning:'Two-RPC corroboration is not cryptographic finality, an independently verified settlement proof, or evidence of any swap or savings.',
  }
}
export function formatObservationSummary(pass:ReturnType<typeof createObservationPass>) {
  const status=pass.transaction.receiptStatus==='reverted'?'REVERTED':'included'
  return 'X3 DEX Proof Pass — TESTNET RPC OBSERVATION\n'+
    pass.network+' · '+status+' · '+pass.confirmations+' RPC confirmations\n'+
    'Transaction: '+pass.explorer+'\n'+
    'Observation digest: '+pass.observationDigest+'\n'+
    'Two RPC endpoints corroborated the receipt. NOT independently finality verified.\n'+
    'No swap or savings claim. Not proof of cross-chain settlement.'
}
