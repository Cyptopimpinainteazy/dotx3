# NEAR integration and submission scope

Reviewed November 11, 2026 against X3Lang snapshot `4243c68157c32f520ba189fc02865a36bbcabec1`.
This review does not replace the separately pinned Bootcamp toolchain or browser checker.

## Integration boundaries

- [1Click](https://docs.near-intents.org/integration/distribution-channels/1click-api/quickstart/introduction) supplies the higher-level swap workflow. Its quickstart states that official NEAR Intents has no testnet version.
- The [Intents SDK](https://docs.near-intents.org/integration/devkit/intents-sdk) supplies lower-level intent execution and withdrawals. It is distinct from 1Click SDKs and the .x3 toolchain.
- [Official NEAR SHIELD](https://docs.near-intents.org/security-compliance/proactive-intents-security) handles incident/security posture for integrated NEAR Intents surfaces. X3 Shield is this project's compiler, mandate and Guard workflow; no integration between the two is established here.
- Historical Tidepool delivery used Base Sepolia and NEAR testnet with a trusted relay. It does not establish official 1Click settlement or cryptographic cross-chain atomicity.

## Track scope

The reviewed README lists three tracks. The judge package, control document and checklist name Security and Agents as the submission scope; the DeFi assessment calls the third track proposed. The website presents three perspectives and must not label all three as confirmed entries. Owner confirmation or an authoritative application record is needed to establish actual submission selections.

Historical testnet delivery is evidence for the DeFi assessment, not merely a future route. Official funded 1Click settlement remains a separate evidence requirement. Preserve that distinction when updating upstream submission copy.

## Explorer and distribution access

The owner reports an explorer and a distribution-channel API key. The explorer URL and key provider are not yet identified. No authenticated integration or provider enrollment is verified by this statement. An explorer can support transaction inspection; credentials can enable quotes. Neither alone demonstrates deposit, destination delivery or causal binding.

Configure credentials only in the provider's documented server-side secret mechanism after identifying the provider. Do not put keys in browser-prefixed environment variables, client bundles, source links, screenshots or evidence artifacts. Do not attach a new fee or initiate a funded trade from this documentation update.

## Inspected snapshot references

- [Project overview](https://github.com/Cyptopimpinainteazy/x3lang/blob/4243c68157c32f520ba189fc02865a36bbcabec1/README.md)
- [Why X3 Shield](https://github.com/Cyptopimpinainteazy/x3lang/blob/4243c68157c32f520ba189fc02865a36bbcabec1/docs/hackathon/WHY_X3_SHIELD.md)
- [Judge package](https://github.com/Cyptopimpinainteazy/x3lang/blob/4243c68157c32f520ba189fc02865a36bbcabec1/docs/hackathon/JUDGE_PACKAGE.md)
- [Judge guide](https://github.com/Cyptopimpinainteazy/x3lang/blob/4243c68157c32f520ba189fc02865a36bbcabec1/docs/hackathon/JUDGE_GUIDE.md)
- [Programming guide](https://github.com/Cyptopimpinainteazy/x3lang/blob/4243c68157c32f520ba189fc02865a36bbcabec1/docs/x3-lang/PROGRAMMING_GUIDE.md)
- [Signed-quote refusal demo](https://github.com/Cyptopimpinainteazy/x3lang/blob/4243c68157c32f520ba189fc02865a36bbcabec1/docs/hackathon/X3_SHIELD_SIGNED_QUOTE_REFUSAL_DEMO.md)
- [Guard evidence](https://github.com/Cyptopimpinainteazy/x3lang/blob/4243c68157c32f520ba189fc02865a36bbcabec1/docs/hackathon/GUARD_TESTNET_EVIDENCE.md)
- [First-swap walkthrough](https://github.com/Cyptopimpinainteazy/x3lang/blob/4243c68157c32f520ba189fc02865a36bbcabec1/docs/hackathon/FIRST_SWAP_JUDGE_WALKTHROUGH.md)
- [DeFi assessment](https://github.com/Cyptopimpinainteazy/x3lang/blob/4243c68157c32f520ba189fc02865a36bbcabec1/docs/hackathon/DEFI_TRACK_EVIDENCE_AND_GAPS.md)
- [Submission checklist](https://github.com/Cyptopimpinainteazy/x3lang/blob/4243c68157c32f520ba189fc02865a36bbcabec1/docs/hackathon/SUBMISSION_CHECKLIST.md)
