import { useEffect, useState } from 'react'
import { Wallet, LogOut } from 'lucide-react'

type Eip1193Provider = {
  request(args: {method:string; params?: unknown[]}): Promise<unknown>
  on?(event:string,listener:(value:unknown)=>void):void
  removeListener?(event:string,listener:(value:unknown)=>void):void
}
declare global { interface Window { ethereum?: Eip1193Provider } }
const CHAINS: Record<string,string> = { '0x1':'Ethereum', '0x2105':'Base', '0xaa36a7':'Sepolia', '0x14a34':'Base Sepolia' }
function normalizeAccount(value:unknown):string|null {
  if (!Array.isArray(value)) return null
  const first=value[0]
  return typeof first==='string'&&/^0x[0-9a-fA-F]{40}$/.test(first)?first:null
}
export default function WalletConnect() {
  const [account,setAccount]=useState<string|null>(null)
  const [chain,setChain]=useState<string|null>(null)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const provider=typeof window==='undefined'?undefined:window.ethereum
  useEffect(()=>{
    if(!provider)return
    const accounts=(value:unknown)=>setAccount(normalizeAccount(value))
    const network=(value:unknown)=>setChain(typeof value==='string'&&/^0x[0-9a-fA-F]+$/.test(value)?value.toLowerCase():null)
    const disconnected=()=>{setAccount(null);setChain(null)}
    provider.on?.('accountsChanged',accounts)
    provider.on?.('chainChanged',network)
    provider.on?.('disconnect',disconnected)
    void Promise.resolve().then(async()=>{
      try {
        const [current,networkId]=await Promise.all([provider.request({method:'eth_accounts'}),provider.request({method:'eth_chainId'})])
        setAccount(normalizeAccount(current))
        setChain(typeof networkId==='string'&&/^0x[0-9a-fA-F]+$/.test(networkId)?networkId.toLowerCase():null)
      }catch{setAccount(null);setChain(null)}
    })
    return ()=>{provider.removeListener?.('accountsChanged',accounts);provider.removeListener?.('chainChanged',network);provider.removeListener?.('disconnect',disconnected)}
  },[provider])
  async function connect(){
    setError('')
    if(!provider){setError('No injected EVM wallet detected. Install a compatible wallet.');return}
    setBusy(true)
    try{
      const accounts=await provider.request({method:'eth_requestAccounts'})
      setAccount(normalizeAccount(accounts))
      const network=await provider.request({method:'eth_chainId'})
      setChain(typeof network==='string'?network.toLowerCase():null)
    }catch(e){setError(e instanceof Error?e.message:'Wallet request rejected')}
    finally{setBusy(false)}
  }
  function disconnect(){
    // EIP-1193 does not provide a universal wallet-level revoke action.
    // This only hides the account in the UI; wallet permissions must be revoked in the wallet.
    setAccount(null);setError('UI session cleared. Revoke website permissions in your wallet to fully disconnect.')
  }
  return <div style={{display:'flex',alignItems:'center',gap:8}}>
    {account ? <><span title={'Connected wallet · '+(CHAINS[chain??'']??'Unsupported network')} style={{fontSize:11,color:'#70bdd4'}}>{CHAINS[chain??'']??'Unsupported chain'} · {account.slice(0,6)}…{account.slice(-4)}</span><button className="wallet-button" onClick={disconnect} title="Clear wallet address display"><LogOut size={14}/></button></>
      : <button className="wallet-button" onClick={connect} disabled={busy}><Wallet size={17}/>{busy?'Connecting…':'Connect EVM wallet'}</button>}
    {error&&<span role="status" title={error} style={{fontSize:10,color:'#eda18f',maxWidth:175}}>{error}</span>}
  </div>
}
