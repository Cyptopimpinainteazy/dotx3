# NEAR Intents Explorer access

The official [Explorer](https://explorer.near-intents.org/) shows historical
1Click swap records. The read-only API uses the fixed endpoint
`https://explorer.near-intents.org/api/v0/transactions` and a Partner Dashboard
Explorer JWT in the Authorization header. This credential is separate from the
NEAR Builders key and must not be assumed to authorize the quote API.

## Use the read-only tool

Inject `NEAR_INTENTS_EXPLORER_JWT` through your shell or secret manager. For a
temporary Bash session, this reads it without echoing or putting it in history:

```bash
read -rsp 'Explorer JWT: ' NEAR_INTENTS_EXPLORER_JWT
export NEAR_INTENTS_EXPLORER_JWT
node scripts/near-intents-explorer.mjs --search dotx3.near --limit 25 --pages 1
unset NEAR_INTENTS_EXPLORER_JWT
```

The tool only sends GET requests to the official host, rejects redirects, caps
pages at 10 and records per page at 100, and times out each request after 15 seconds.
It uses `lastDepositAddress` and `lastDepositMemo` for older-page cursors and waits
5.1 seconds between requests. A 429 stops without automatic retries. The partner
limit is shared across tools and sessions: run one reader at a time and coordinate
other clients using the same partner ID. The tool cannot enforce a global quota
across unrelated processes or services.

JSON goes to stdout and may contain addresses and financial history. Review it
before saving or publishing. No credential or history is saved by the tool. No
public proxy for authenticated partner history is exposed by this integration.

## Verification and evidence limits

On November 11, 2026, the tool completed an authenticated live request with
`search=dotx3.near`, `numberOfTransactions=5`, `direction=next`: the provider
returned an empty array. This verifies access and that query only; it does not
prove that the account has never transacted or that every partner/referral record
has been inspected. The secret was supplied only in memory and was not persisted.

Returned statuses remain provider history, with `independentlyVerified: false`.
Verify source and destination chain records separately before claiming settlement.
This tool never requests a quote, creates a deposit address, changes fees, signs,
funds, or settles a swap. A distribution-channel quote JWT must be configured and
verified separately before any quote integration is claimed.

## References

- [Explorer API documentation](https://docs.near-intents.org/integration/distribution-channels/1click-api/explorer)
- [Transaction parameters and pagination](https://docs.near-intents.org/integration/distribution-channels/1click-api/explorer/transactions)
- [OpenAPI specification](https://explorer.near-intents.org/api/v0/openapi.yaml)
- [Partner Dashboard](https://partners.near-intents.org/)

The documented API limit is one request per five seconds per partner. Recheck the
provider documentation when updating the integration.
