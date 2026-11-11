# NEAR Business and dotx3

Reviewed against the official documentation on 2026-11-11. This guide links the external treasury product; it does not claim a deployed dotx3 treasury connector.

## Two separate services

[NEAR Builders](NEAR_BUILDERS_MCP.md) maintains the builder directory. A `dotx3.near` directory profile, including any directory approval, is not proof of a treasury, its membership or signing authority. Its MCP API key is scoped to that service and must not be sent to NEAR Business.

[NEAR Business](https://business.near.com/) is a team treasury application. Its [overview](https://docs.business.near.com/what-is) describes multisig-based, multi-chain asset management with financial details restricted to treasury members. The [confidentiality guide](https://docs.business.near.com/confidential-treasuries) describes the private-shard and external-chain funding model. Those are NEAR Business product claims, separate from dotx3's public Guard/testnet evidence.

## Roles and execution

According to the [role reference](https://docs.business.near.com/governance/members-and-roles):

| Role       | Responsibility                                                                        |
| ---------- | ------------------------------------------------------------------------------------- |
| Requestor  | Proposes financial actions; this role alone cannot vote.                              |
| Finance    | Votes on financial requests; this role alone cannot create them or change membership. |
| Governance | Controls membership and treasury configuration through governance requests.           |

Membership may combine roles. [Voting settings](https://docs.business.near.com/governance/voting-settings) distinguish Finance and Governance thresholds. A threshold-reaching approval can trigger execution immediately; voting is an operational action, not a read-only review.

## Where .x3 can help

The existing .x3 tools can prepare an owner-readable policy report showing payment recipient, asset, amount, refund terms and source hashes. That report can support a human review. This repository has not established a NEAR Business adapter that translates .x3 into a treasury request or makes treasury execution depend on Guard.

A policy pass therefore does not establish NEAR Business authorization. Likewise, a treasury request or PDF receipt must not be relabeled as independent cross-chain finality evidence. Keep policy evaluation, proposal/vote state, execution and delivered funds distinct.

The public documentation index reviewed here documents user workflows; it does not establish a developer MCP endpoint or authenticated API contract for this repository to call. Do not invent one.

## Inspect an existing account

Use the official [application](https://business.near.com/) and the user's existing login. [Login documentation](https://docs.business.near.com/login) covers wallet, passkey and Ledger options. Authentication and any wallet confirmation remain with the account holder.

Before implementing a connector, identify the intended treasury and inspect membership/roles, voting thresholds and duration. An initial inspection needs no new payment, role change, funding or governance request. Record only the non-confidential identifiers and implementation details the user authorizes for the project. Financial details and treasury-member data do not belong in this public repository.

[Payment creation](https://docs.business.near.com/payments/single-payment) and [payment handling](https://docs.business.near.com/payments/handling-requests) explain the product's request/review/receipt workflow. Actual financial requests, votes, transfers and governance changes require a separately specified action and account-holder authorization.

## Current integration state

- Builder directory: the originating integration work reports that the `dotx3.near` profile was approved and applied through NEAR Builders MCP. No timestamped response or independently reproducible verification receipt is included here; treat that status as reported, not independently verified repository evidence. Recheck the authenticated account and current profile through a read-only lookup before relying on it.
- NEAR Business treasury: no treasury identifier configured or account session inspected by this work.
- Treasury API, policy enforcement and payment execution: no integration claimed.
