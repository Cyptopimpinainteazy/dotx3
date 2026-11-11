import { crosscheck } from '../../../integrations/x3dex/server/testnet-crosscheck.mjs';
import { getIndicativePrice } from '../../../integrations/x3dex/server/indicative.mjs';
const blocked = (error) => ({status:400,body:{error,executable:false,executionAllowed:false,finalityVerified:false}});
export async function optionalService(path, params, {check=crosscheck, price=getIndicativePrice}={}) {
  if (path === 'crosscheck') {
    const keys=[...params.keys()];
    if(keys.length!==2 || new Set(keys).size!==2 || keys.some(k=>!['chain','hash'].includes(k)))
      return blocked('INVALID_TESTNET_REQUEST');
    return check({chain:params.get('chain'),hash:params.get('hash')});
  }
  if (path === 'indicative') {
    const keys=[...params.keys()];
    if(keys.length!==4 || new Set(keys).size!==4 || keys.some(k=>!['chainId','sellToken','buyToken','sellAmount'].includes(k)))
      return blocked('INVALID_QUOTE_REQUEST');
    try {return await price(params);} catch {return blocked('INVALID_QUOTE_REQUEST');}
  }
  return null;
}
