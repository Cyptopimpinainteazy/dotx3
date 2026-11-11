import test from "node:test";
import assert from "node:assert/strict";
import { readTransactions, EXPLORER_URL } from "./near-intents-explorer.mjs";

test("GET stays on official host, uses bearer header and paginates after rate wait", async () => {
  const requests = [],
    waits = [];
  const result = await readTransactions({
    token: "synthetic-token",
    search: "dotx3.near",
    limit: 1,
    pages: 2,
    wait: async (ms) => {
      waits.push(ms);
    },
    fetchImpl: async (url, options) => {
      requests.push({ url, options });
      return Response.json([
        { depositAddress: requests.length === 1 ? "first" : "second", depositMemo: "memo" },
      ]);
    },
  });
  assert.equal(requests.length, 2);
  assert.equal(requests[0].url.origin + requests[0].url.pathname, EXPLORER_URL);
  assert.equal(requests[0].options.method, "GET");
  assert.equal(requests[0].options.headers.Authorization, "Bearer synthetic-token");
  assert.equal(requests[0].options.redirect, "error");
  assert.equal(requests[1].url.searchParams.get("lastDepositAddress"), "first");
  assert.equal(requests[1].url.searchParams.get("lastDepositMemo"), "memo");
  assert.deepEqual(waits, [5100]);
  assert.equal(result.independentlyVerified, false);
  assert.ok(!JSON.stringify(result).includes("synthetic-token"));
});

test("missing credentials and invalid options fail before network access", async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls++;
    throw Error("should not run");
  };
  for (const overrides of [{ token: "" }, { search: "" }, { pages: 11 }, { limit: 0 }]) {
    await assert.rejects(
      readTransactions({ token: "synthetic-token", search: "dotx3.near", fetchImpl, ...overrides }),
    );
  }
  assert.equal(calls, 0);
});

test("429 and authentication errors stop without retries or exposing provider body", async () => {
  for (const status of [429, 401, 403, 500]) {
    let calls = 0;
    await assert.rejects(
      readTransactions({
        token: "synthetic-token",
        search: "dotx3.near",
        pages: 2,
        fetchImpl: async () => {
          calls++;
          return new Response("secret-response", { status });
        },
      }),
      (error) => !error.message.includes("secret-response"),
    );
    assert.equal(calls, 1);
  }
});

test("invalid responses and looping cursors fail closed", async () => {
  await assert.rejects(
    readTransactions({
      token: "synthetic-token",
      search: "dotx3.near",
      fetchImpl: async () => Response.json({ transactions: [] }),
    }),
  );
  await assert.rejects(
    readTransactions({
      token: "synthetic-token",
      search: "dotx3.near",
      limit: 1,
      pages: 3,
      wait: async () => {},
      fetchImpl: async () => Response.json([{ depositAddress: "same" }]),
    }),
    /repeated pagination cursor/,
  );
});
