import { createFileRoute } from '@tanstack/react-router';
import { createMarketService, readJson } from '../../../../integrations/x3dex/server/markets.mjs';
const markets = createMarketService();
export const Route = createFileRoute('/api/x3dex/$')({server:{handlers:{GET:async ({request})=>{
 const url=new URL(request.url); const path=url.pathname.split('/').pop();
 const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 try {
 if(path==='markets') return reply(await markets.get());
 if(path==='ohlc') {
 const pair=url.searchParams.get('pair')||''; const interval=url.searchParams.get('interval')||'';
 if(!['XBTUSD','ETHUSD','SOLUSD','AVAXUSD'].includes(pair)||!['1','5','15','60','240','1440'].includes(interval))return reply({error:'Unsupported market'},400);
 return reply(await readJson('https://api.kraken.com/0/public/OHLC?pair='+pair+'&interval='+interval));
 }
 return reply({error:'This optional service is not enabled on dotx3',executable:false,executionAllowed:false,finalityVerified:false},503);
 }catch{return reply({error:'Market service unavailable',executable:false},503);}
}}}});
