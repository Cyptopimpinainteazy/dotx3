// Only add referral URLs copied from the owner's provider dashboard.
// A NEAR account name alone does not establish an active referral code.
export const partnerLinks: Record<
  "meteor" | "rhea",
  { name: string; officialUrl: string; referralUrl: string | null }
> = {
  meteor: {
    name: "Meteor Wallet",
    officialUrl: "https://meteorwallet.app/",
    referralUrl: "https://wallet.meteorwallet.app/referral?referralCode=dotx3.near",
  },
  rhea: {
    name: "RHEA Finance",
    officialUrl: "https://app.rhea.finance/",
    referralUrl: null,
  },
};
