// Read-only NEAR testnet lookups for the /ide demo, served same-origin by /api/near/testnet.
//
// The browser sends a small, fixed vocabulary (?m=status | block | chunk | account | tx). The
// server rebuilds the JSON-RPC params from validated fields, so nothing the visitor types is
// forwarded raw, no write method (send_tx, broadcast_*) can be reached, and responses are
// trimmed to what the demo shows.

export const TESTNET_RPCS = ["https://rpc.testnet.fastnear.com", "https://rpc.testnet.near.org"];

const ACCOUNT_ID = /^(?=.{2,64}$)(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
const BASE58_HASH = /^[1-9A-HJ-NP-Za-km-z]{43,44}$/;

export type Lookup =
  | { m: "status" }
  | { m: "block"; id: "final" | number | string }
  | { m: "chunk"; id: string }
  | { m: "account"; id: string }
  | { m: "tx"; hash: string; sender: string };

export class LookupError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function parseLookup(q: URLSearchParams): Lookup {
  const m = q.get("m");
  const id = (q.get("id") ?? "").trim();
  switch (m) {
    case "status":
      return { m };
    case "block":
      if (!id || id === "final") return { m, id: "final" };
      if (/^\d{1,12}$/.test(id)) return { m, id: Number(id) };
      if (BASE58_HASH.test(id)) return { m, id };
      throw new LookupError("BAD_BLOCK", "Block must be a height or a block hash");
    case "chunk":
      if (BASE58_HASH.test(id)) return { m, id };
      throw new LookupError("BAD_CHUNK", "Chunk must be a chunk hash");
    case "account":
      if (ACCOUNT_ID.test(id)) return { m, id };
      throw new LookupError("BAD_ACCOUNT", "Not a valid NEAR account id");
    case "tx": {
      const hash = (q.get("hash") ?? "").trim();
      const sender = (q.get("sender") ?? "").trim();
      if (!BASE58_HASH.test(hash)) throw new LookupError("BAD_TX", "Not a transaction hash");
      if (!ACCOUNT_ID.test(sender)) throw new LookupError("BAD_ACCOUNT", "Not a valid signer account id");
      return { m, hash, sender };
    }
    default:
      throw new LookupError("BAD_METHOD", "Unknown lookup");
  }
}

export function rpcRequest(l: Lookup): { method: string; params: unknown } {
  switch (l.m) {
    case "status":
      return { method: "status", params: [] };
    case "block":
      return { method: "block", params: l.id === "final" ? { finality: "final" } : { block_id: l.id } };
    case "chunk":
      return { method: "chunk", params: { chunk_id: l.id } };
    case "account":
      return { method: "query", params: { request_type: "view_account", finality: "final", account_id: l.id } };
    case "tx":
      return { method: "tx", params: { tx_hash: l.hash, sender_account_id: l.sender, wait_until: "NONE" } };
  }
}

type Json = Record<string, any>;

/** Keep only what the demo renders. */
export function trim(l: Lookup, r: Json): Json {
  switch (l.m) {
    case "status":
      return {
        chainId: r.chain_id,
        nodeVersion: r.version?.version,
        protocolVersion: r.protocol_version,
        height: r.sync_info?.latest_block_height,
        hash: r.sync_info?.latest_block_hash,
        time: r.sync_info?.latest_block_time,
      };
    case "block":
      return {
        height: r.header?.height,
        hash: r.header?.hash,
        prevHash: r.header?.prev_hash,
        time: r.header ? new Date(Number(BigInt(r.header.timestamp_nanosec) / 1_000_000n)).toISOString() : null,
        author: r.author,
        // A shard with no new chunk repeats its older one; count only chunks produced in this block.
        gasUsed: (r.chunks ?? [])
          .filter((c: Json) => c.height_included === r.header?.height)
          .reduce((a: bigint, c: Json) => a + BigInt(c.gas_used ?? 0), 0n)
          .toString(),
        chunks: (r.chunks ?? [])
          .filter((c: Json) => c.height_included === r.header?.height)
          .map((c: Json) => ({ hash: c.chunk_hash, shard: c.shard_id, txs: c.tx_root !== "11111111111111111111111111111111" })),
      };
    case "chunk":
      return {
        hash: r.header?.chunk_hash,
        shard: r.header?.shard_id,
        transactions: (r.transactions ?? []).slice(0, 50).map((t: Json) => ({
          hash: t.hash,
          signerId: t.signer_id,
          receiverId: t.receiver_id,
          actions: (t.actions ?? []).map((a: unknown) => (typeof a === "string" ? a : Object.keys(a as Json)[0])),
        })),
      };
    case "account":
      return {
        accountId: l.id,
        amount: r.amount,
        locked: r.locked,
        storageUsage: r.storage_usage,
        codeHash: r.code_hash,
        hasContract: r.code_hash !== "11111111111111111111111111111111",
        blockHeight: r.block_height,
      };
    case "tx": {
      // status is an object when final (SuccessValue / SuccessReceiptId / Failure) and a bare
      // string ("NotStarted", "Started") while the transaction is still executing.
      const st: Json = r.status && typeof r.status === "object" ? r.status : {};
      const outcomes = [r.transaction_outcome, ...(r.receipts_outcome ?? [])].filter(Boolean);
      return {
        hash: l.hash,
        signerId: r.transaction?.signer_id ?? l.sender,
        receiverId: r.transaction?.receiver_id,
        status: "SuccessValue" in st || "SuccessReceiptId" in st ? "succeeded" : "Failure" in st ? "failed" : "pending",
        failure: st.Failure ?? null,
        gasBurnt: outcomes.reduce((a: bigint, o: Json) => a + BigInt(o.outcome?.gas_burnt ?? 0), 0n).toString(),
        logs: outcomes.flatMap((o: Json) => o.outcome?.logs ?? []).slice(0, 40),
        actions: (r.transaction?.actions ?? []).map((a: unknown) => (typeof a === "string" ? a : Object.keys(a as Json)[0])),
      };
    }
  }
}

const UNREACHABLE = new LookupError("TESTNET_UNREACHABLE", "NEAR testnet RPC did not answer", 503);

export async function lookup(l: Lookup, fetchImpl: typeof fetch = fetch, rpcs = TESTNET_RPCS): Promise<Json> {
  const { method, params } = rpcRequest(l);
  let last: LookupError = UNREACHABLE;
  for (const url of rpcs) {
    let body: Json;
    try {
      const res = await fetchImpl(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: "dotx3-ide", method, params }),
        signal: AbortSignal.timeout(8000),
      });
      if (res.status >= 500 || res.status === 429) {
        last = UNREACHABLE;
        continue;
      }
      body = await res.json();
    } catch {
      last = UNREACHABLE;
      continue;
    }
    if (body.error) {
      const cause = body.error.cause?.name ?? body.error.name ?? "RPC_ERROR";
      const message = body.error.cause?.info?.error_message ?? body.error.data ?? body.error.message ?? "RPC error";
      const notFound = /UNKNOWN_(ACCOUNT|BLOCK|CHUNK|TRANSACTION)|DOES_NOT_EXIST/.test(String(cause));
      throw new LookupError(String(cause), typeof message === "string" ? message : JSON.stringify(message), notFound ? 404 : 502);
    }
    return trim(l, body.result);
  }
  throw last;
}

export function formatNear(yocto: string | undefined): string {
  if (!yocto) return "0";
  const v = BigInt(yocto);
  const whole = v / 10n ** 24n;
  const frac = ((v % 10n ** 24n) * 10000n) / 10n ** 24n;
  return `${whole.toLocaleString("en-US")}.${frac.toString().padStart(4, "0")}`;
}
