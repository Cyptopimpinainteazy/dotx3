/** User-approved testnet wallet smoke only. No swaps, token movements or mainnet writes. */
export const TESTNETS = {
  '0xaa36a7': { name:'Ethereum Sepolia', chainId:11155111, explorer:'https://sepolia.etherscan.io/tx/' },
  '0x14a34': { name:'Base Sepolia', chainId:84532, explorer:'https://sepolia.basescan.org/tx/' },
} as const
export type TestChain = keyof typeof TESTNETS
export type Provider = { request(args:{method:string;params?:unknown[]}):Promise<unknown> }
export type Prepared = { chain:TestChain; account:string; gasLimit:'0x5208'; gasPriceWei:string; estimateWei:string }
export type ReceiptObservation =
 | {status:'pending'; finalityVerified:false}
 | {status:'included'|'reverted'; confirmations:number; blockNumber:string; blockHash:string; finalityVerified:false}

const ADDRESS=/^0x[0-9a-fA-F]{40}$/
const HASH=/^0x[0-9a-fA-F]{64}$/
const HEX=/^0x(?:0|[1-9a-fA-F][0-9a-fA-F]*)$/
function quantity(value:unknown):bigint {
 if(typeof value!=='string'||value.length>68||!HEX.test(value))throw new Error('Invalid provider quantity')
 return BigInt(value)
}
function address(v:unknown):string {
 if(typeof v!=='string'||!ADDRESS.test(v))throw new Error('Invalid wallet account')
 return v
}
function sameAddress(a:unknown,b:unknown):boolean {
 return typeof a==='string'&&typeof b==='string'&&ADDRESS.test(a)&&ADDRESS.test(b)&&a.toLowerCase()===b.toLowerCase()
}
export async function prepare(provider:Provider,chain:TestChain):Promise<Prepared>{
 if(!TESTNETS[chain])throw new Error('Unsupported chain')
 const connected=await provider.request({method:'eth_chainId'})
 if(connected!==chain)throw new Error('Select '+TESTNETS[chain].name+' in your wallet before preparing')
 const accounts=await provider.request({method:'eth_accounts'})
 if(!Array.isArray(accounts)||!accounts.length)throw new Error('Connect an EVM wallet before preparing')
 const wallet=address(accounts[0])
 const code=await provider.request({method:'eth_getCode',params:[wallet,'latest']})
 if(code!=='0x')throw new Error('Contract account unsupported for self-transfer smoke')
 const transaction={from:wallet,to:wallet,value:'0x0',data:'0x'}
 const estimated=quantity(await provider.request({method:'eth_estimateGas',params:[transaction]}))
 if(estimated!==21000n)throw new Error('Unexpected gas estimate for zero-value self-transfer')
 const gasPrice=quantity(await provider.request({method:'eth_gasPrice'}))
 const balance=quantity(await provider.request({method:'eth_getBalance',params:[wallet,'latest']}))
 if(balance<21000n*gasPrice)throw new Error('Insufficient testnet ETH for estimated gas')
 if(await provider.request({method:'eth_chainId'})!==chain)throw new Error('Wallet network changed during checks')
 return {chain,account:wallet,gasLimit:'0x5208',gasPriceWei:gasPrice.toString(),estimateWei:(21000n*gasPrice).toString()}
}
export async function submit(provider:Provider,prepared:Prepared):Promise<string>{
 // Re-run all checks at submission; UI can never pass a different recipient or value.
 const fresh=await prepare(provider,prepared.chain)
 if(!sameAddress(fresh.account,prepared.account))throw new Error('Connected account changed')
 const hash=await provider.request({method:'eth_sendTransaction',params:[{
  from:fresh.account,to:fresh.account,value:'0x0',data:'0x',gas:'0x5208',
 }]})
 if(typeof hash!=='string'||!HASH.test(hash))throw new Error('Wallet did not return a valid transaction hash')
 return hash
}
export async function observe(provider:Provider,chain:TestChain,account:string,hash:string):Promise<ReceiptObservation>{
 if(!HASH.test(hash)||!ADDRESS.test(account)||!TESTNETS[chain])throw new Error('Invalid tracking parameters')
 if(await provider.request({method:'eth_chainId'})!==chain)throw new Error('Wrong wallet chain for receipt')
 const receipt=await provider.request({method:'eth_getTransactionReceipt',params:[hash]})
 if(receipt===null)return {status:'pending',finalityVerified:false}
 if(!receipt||typeof receipt!=='object')throw new Error('Malformed receipt')
 const r=receipt as Record<string,unknown>
 const transaction=await provider.request({method:'eth_getTransactionByHash',params:[hash]})
 if(!transaction||typeof transaction!=='object')throw new Error('Transaction not available for independent checks')
 const tx=transaction as Record<string,unknown>
 if(String(r.transactionHash).toLowerCase()!==hash.toLowerCase()||
    String(tx.hash).toLowerCase()!==hash.toLowerCase()||
    !sameAddress(tx.from,account)||!sameAddress(tx.to,account)||
    !sameAddress(r.from,account)||!sameAddress(r.to,account)||
    quantity(tx.value)!==0n||tx.input!=='0x'||
    quantity(tx.gas)!==21000n||
    typeof r.blockHash!=='string'||!HASH.test(r.blockHash)||
    String(tx.blockHash).toLowerCase()!==r.blockHash.toLowerCase())
   throw new Error('Receipt/transaction mismatch — verification stopped')
 const blockHeight=quantity(r.blockNumber)
 const block=await provider.request({method:'eth_getBlockByNumber',params:[r.blockNumber,false]})
 if(!block||typeof block!=='object'||String((block as Record<string,unknown>).hash).toLowerCase()!==r.blockHash.toLowerCase())
   throw new Error('Block hash mismatch or chain reorganization')
 const latest=quantity(await provider.request({method:'eth_blockNumber'}))
 if(latest<blockHeight)throw new Error('Receipt block beyond chain head')
 const status=quantity(r.status)
 if(status!==0n&&status!==1n)throw new Error('Invalid receipt status')
 const confirmations=Number(latest-blockHeight+1n)
 return {status:status===1n?'included':'reverted',confirmations,blockNumber:String(r.blockNumber),blockHash:r.blockHash,finalityVerified:false}
}
