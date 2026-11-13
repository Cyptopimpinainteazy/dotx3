# Referral links

Reviewed November 11, 2026. Owner-supplied referral account: `dotx3.near`.
The owner supplied the exact Meteor referral URL on this date. It is now configured in the site source; provider eligibility and payouts have not been independently verified.

`src/lib/partner-links.ts` controls the Meteor and RHEA placements. Meteor uses the owner-supplied referral link. RHEA continues to use its ordinary official URL until its own referral link is supplied.
Set `referralUrl` to the exact HTTPS link copied from the provider's signed-in
referral dashboard. Confirm it identifies the owner's account before publishing.
Referral placements automatically show a reward disclosure and use `rel="sponsored"`.
Referral URLs are public; never place wallet secrets or API keys in this configuration.

| Service                       | Evidence and next step                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Meteor Wallet                 | The publisher's [App Store version history](https://apps.apple.com/us/app/meteor-wallet/id6739558223) lists a referral feature. Its [referral dashboard](https://wallet.meteorwallet.app/referral) requires sign-in. Configured owner-supplied link: [dotx3.near referral](https://wallet.meteorwallet.app/referral?referralCode=dotx3.near). No reward rate or payout is assumed. |
| RHEA Finance                  | The official [points page](https://app.rhea.finance/points) includes a Referral Link. Its [points guide](https://guide.rhea.finance/near-chain-guides/rhea-point-system) describes campaign referral points, not guaranteed cash commissions. Verify current eligibility and copy the account-generated link.                                                                      |
| NEAR Business / NEAR Builders | No public affiliate program was confirmed during this review. Keep their ordinary links.                                                                                                                                                                                                                                                                                           |
| NEAR Intents                  | [Distribution-channel fees](https://docs.agentsonintents.com/integration/distribution-channels/1click-api/fee-config) are quote integration settings, not ordinary affiliate hyperlinks. No swap fees or quote requests were changed for this task.                                                                                                                                |

Do not infer referral IDs from account names, copy another user's search-result
link, or replace source/evidence links with promotional destinations. This change
does not enroll the owner in any program or accept provider agreements.
