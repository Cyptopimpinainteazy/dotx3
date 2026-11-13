/* X3 Force Field read-only archived evidence checks. NOT a consensus verifier. */
export const EXPECT = Object.freeze({
  mandate: "eea021d5cc1118801f4e1d3b9c0efe89fc59a7f654031f9ff1951aa1f2f3d515",
  payment: "9ee29a5603cfa1e7d9fdbd866cf330ce35e6b5f0907c6844dd2ef1a213768ba0",
  guard: "x3lang.near",
  agent: "x3-agent.x3lang.near",
  nonce: "mainnet_demo_nov11_invoice_06",
  key: "ed25519:J3NiU8J63HAfz2MTDu1zQVhFRYS5Pio21h1kNtJdP11x",
  recovery: "ed25519:8teaXGYFELKQN5QA7gQqeA4B7URrcMQqaczZ5D68c23u",
  deposit: "4zhGYyWNabYQ5gixTUzoVHVbgFKWAsQssSpCv3B1J1LjCRisEJW6wm3zuS2GVuDotAT93S8wm1qezHwsKX2RkXo5",
  payout: "8jfbACLSxrzi3fnajfAVGc4Fgo6XLCWA1mpiJWXPw43P",
  outcome: "9sTn9pJ1ZbCVazBm9Wz9oEDh6aWw4FUVMoAJEKCCzuqE",
  solFunder: "58tbMfadmi8HWzUndLqkX3prBbkiZMEaYMTDYSzhB3cQ",
  solDeposit: "C6978ATtM33Acw79Dh3y6K5syfzJtwcvo6t6b62UdkN",
  solUSDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  nearUSDC: "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1"
});
const result = (name, status, detail, evidence) => ({ name, status, detail, evidence });
const match = (name, value, expected, evidence) => result(name, value == null ? "UNVERIFIED" : value === expected ? "PASS" : "FAIL", value == null ? "Required field missing" : "Observed: "+String(value), evidence);
const success = t => t && t.final_execution_status === "FINAL" && t.status && Object.hasOwn(t.status,"SuccessValue") && (t.receipts||[]).every(r=>!(r.status&&Object.hasOwn(r.status,"Failure")));
const decode64 = input => {
  if (typeof input !== "string") return null;
  try {
    if (typeof atob === "function") return JSON.parse(atob(input));
    return JSON.parse(Buffer.from(input,"base64").toString("utf8"));
  } catch { return null; }
};
const delta = (balances,owner) => (balances||[]).filter(b=>b.owner===owner && b.mint===EXPECT.solUSDC).reduce((n,b)=>n+Number(b.amount),0);
export function verifyArchived(observation, finalized, hashes={}) {
  const rows=[], add=(n,s,d,e)=>rows.push(result(n,s,d,e));
  if (!observation || !finalized) return [result("Archived evidence","UNVERIFIED","Missing original RPC snapshots","source")];
  const e=EXPECT, tx=observation.near_transactions||{}, quote=tx.agent_accept_quote||{};
  for (const [name,expected] of [["mandate",e.mandate],["payment",e.payment]]) {
    const h=hashes[name];
    add(name+".x3 bytes",h==null?"UNVERIFIED":h===expected?"PASS":"FAIL",
      h==null?"Source bytes not hashed":h,"Original .x3 source");
  }
  const mandate=observation.mandate?.value?.terms, policy=observation.intent?.value?.policy;
  rows.push(match("Mandate hash in Guard",mandate?.program_sha256,e.mandate,"archived get_mandate"));
  rows.push(match("Payment hash in Guard",policy?.program_sha256,e.payment,"archived get_intent"));
  for (const [name,record] of [["Owner approval",tx.owner_approval],["Agent quote acceptance",quote],["NEAR payout",tx.payout]]) {
    add(name,!record?"UNVERIFIED":success(record)?"PASS":"FAIL",record?.hash||"Missing transaction", "archived NEAR RPC");
  }
  rows.push(match("Restricted agent signer",quote.public_key,e.key,"archived tx"));
  rows.push(match("Quote receiver",quote.receiver_id,e.guard,"archived tx"));
  rows.push(match("Quote method",quote.actions?.[0]?.FunctionCall?.method_name,"agent_accept_quote","archived tx"));
  const keys=observation.agent_access_keys?.result?.keys||[];
  const fk=keys.find(k=>k.public_key===e.key)?.access_key?.permission?.FunctionCall;
  const wanted=["agent_register_intent","agent_accept_quote","agent_record_outcome"];
  add("Restricted key scope",!keys.length?"UNVERIFIED":fk?.receiver_id===e.guard&&
    Array.isArray(fk.method_names)&&wanted.every(m=>fk.method_names.includes(m))&&fk.method_names.length===3?"PASS":"FAIL",
    fk?"FunctionCall permissions recorded":"Restricted key not found","archived access-key RPC");
  add("Owner FullAccess key disclosed",!keys.length?"UNVERIFIED":
    keys.some(k=>k.public_key===e.recovery&&k.access_key?.permission==="FullAccess")?"PASS":"FAIL",
    "FullAccess is a residual authority, not a protection","archived access-key RPC");
  const guards=decode64(quote.status?.SuccessValue);
  add("21 Guard checks",guards==null?"UNVERIFIED":
    Array.isArray(guards)&&guards.length===21&&guards.every(g=>g.ok===true&&typeof g.guard==="string")?"PASS":"FAIL",
    Array.isArray(guards)?guards.length+" decoded checks":"Cannot decode SuccessValue","archived NEAR tx");
  const sol=observation.solana_deposit;
  add("Solana finalized deposit",sol==null?"UNVERIFIED":
    sol.signature===e.deposit&&sol.found===true&&sol.err===null&&Number.isInteger(sol.slot)?"PASS":"FAIL",
    sol?.signature||"Missing deposit","archived Solana RPC");
  const funderDelta=delta(sol?.post_token_balances,e.solFunder)-delta(sol?.pre_token_balances,e.solFunder);
  const depositDelta=delta(sol?.post_token_balances,e.solDeposit)-delta(sol?.pre_token_balances,e.solDeposit);
  add("25 USDC token-balance transfer",!sol?"UNVERIFIED":
    funderDelta===-25000000&&depositDelta===25000000&&sol.signers?.includes(e.solFunder)?"PASS":"FAIL",
    "Funder "+funderDelta+"; deposit "+depositDelta+" base units","archived Solana token balances");
  const logs=(tx.payout?.receipts||[]).flatMap(r=>r.logs||[]);
  let payoutFound=false;
  for (const log of logs) {
    if (!log.startsWith("EVENT_JSON:")) continue;
    try { const ev=JSON.parse(log.slice(11));if(ev.event==="ft_transfer"&&
      (ev.data||[]).some(d=>d.old_owner_id==="intents.near"&&d.new_owner_id===e.guard&&d.amount==="24995200")) payoutFound=true; } catch {}
  }
  add("NEAR 24.9952 USDC payout",!logs.length?"UNVERIFIED":payoutFound?"PASS":"FAIL",
    "NEP-141 ft_transfer event to x3lang.near","archived NEAR receipt logs");
  const readback=finalized.intent_value||finalized.intent_after||finalized.intent_rpc_response?.result?.value;
  const outcome=readback?.outcome;
  rows.push(match("Guard-reported outcome",outcome?.status,"Settled","later finalized Guard readback"));
  rows.push(match("Guard-reported amount",outcome?.amount_out,"24995200","later finalized Guard readback"));
  rows.push(match("Guard-reported floor",outcome?.floor_met,true,"later finalized Guard readback"));
  const t=outcome?.tx_hashes;
  add("Outcome hash references",!Array.isArray(t)?"UNVERIFIED":
    t.length===2&&t.includes(e.deposit)&&t.includes(e.payout)?"PASS":"FAIL",
    "Agent-provided hashes; Guard does not authenticate them","later finalized Guard readback");
  add("Cross-chain atomicity","UNVERIFIED","Not cryptographically proven","explicit limitation");
  add("Guard source-wallet custody","UNVERIFIED","Owner signed the deposit; Guard did not custody the source wallet","explicit limitation");
  add("Live RPC / consensus verification","UNVERIFIED","This mode checks historical public-RPC snapshots, not fresh authenticated chain state","explicit limitation");
  return rows;
}
