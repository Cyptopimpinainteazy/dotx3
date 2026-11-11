#!/usr/bin/env node
import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";

class ExplorerError extends Error {}

export const EXPLORER_URL = "https://explorer.near-intents.org/api/v0/transactions";

export async function readTransactions({
  token,
  search,
  limit = 25,
  pages = 1,
  fetchImpl = fetch,
  wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
}) {
  if (!token || /\s/.test(token))
    throw new ExplorerError("Set NEAR_INTENTS_EXPLORER_JWT to the Explorer JWT.");
  if (!search || search.length > 256)
    throw new ExplorerError(
      "Provide --search with an account, deposit address or transaction hash.",
    );
  if (!Number.isInteger(limit) || limit < 1 || limit > 100)
    throw new ExplorerError("--limit must be 1–100.");
  if (!Number.isInteger(pages) || pages < 1 || pages > 10)
    throw new ExplorerError("--pages must be 1–10.");
  const transactions = [];
  const cursors = new Set();
  let cursor;
  for (let page = 0; page < pages; page++) {
    if (page) await wait(5100);
    const url = new URL(EXPLORER_URL);
    url.searchParams.set("search", search);
    url.searchParams.set("numberOfTransactions", String(limit));
    url.searchParams.set("direction", "next");
    if (cursor) {
      url.searchParams.set("lastDepositAddress", cursor.depositAddress);
      if (cursor.depositMemo) url.searchParams.set("lastDepositMemo", cursor.depositMemo);
    }
    const response = await fetchImpl(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      if (response.status === 429)
        throw new ExplorerError(
          "Explorer rate limit reached; wait before retrying. Other clients share the partner limit.",
        );
      if ([401, 403].includes(response.status))
        throw new ExplorerError("Explorer authentication rejected. Check the Explorer JWT.");
      throw new ExplorerError(`Explorer request failed (HTTP ${response.status}).`);
    }
    // Do not log provider error bodies: they may contain request details.
    const batch = await response.json();
    if (
      !Array.isArray(batch) ||
      batch.some((item) => !item || typeof item !== "object" || Array.isArray(item))
    )
      throw new ExplorerError("Unexpected Explorer response.");
    transactions.push(...batch);
    if (batch.length < limit || page + 1 === pages) break;
    const last = batch.at(-1);
    if (
      typeof last.depositAddress !== "string" ||
      !last.depositAddress ||
      (last.depositMemo != null && typeof last.depositMemo !== "string")
    )
      throw new ExplorerError("Explorer pagination cursor missing or invalid.");
    const key = JSON.stringify([last.depositAddress, last.depositMemo || ""]);
    if (cursors.has(key))
      throw new ExplorerError("Explorer returned a repeated pagination cursor.");
    cursors.add(key);
    cursor = last;
  }
  return {
    source: EXPLORER_URL,
    fetchedAt: new Date().toISOString(),
    search,
    evidence: "provider-history-only",
    independentlyVerified: false,
    transactions,
  };
}

async function main() {
  const { values } = parseArgs({
    options: {
      search: { type: "string" },
      limit: { type: "string", default: "25" },
      pages: { type: "string", default: "1" },
      help: { type: "boolean" },
    },
  });
  if (values.help) {
    console.log(
      "NEAR_INTENTS_EXPLORER_JWT=<secret environment variable> node scripts/near-intents-explorer.mjs --search dotx3.near [--limit 25] [--pages 1]\nRead-only provider history; no quote, signing, funding or independent settlement verification.",
    );
    return;
  }
  const result = await readTransactions({
    token: process.env.NEAR_INTENTS_EXPLORER_JWT,
    search: values.search,
    limit: Number(values.limit),
    pages: Number(values.pages),
  });
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    // Never print arbitrary exceptions or provider bodies with credential context.
    console.error(
      error instanceof ExplorerError
        ? error.message
        : "Explorer read failed. Check search/options, JWT access and the partner rate limit. No transaction was initiated.",
    );
    process.exitCode = 1;
  });
}
