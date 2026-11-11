import { partnerLinks } from "@/lib/partner-links";

export function PartnerLink({ provider }: { provider: keyof typeof partnerLinks }) {
  const partner = partnerLinks[provider];
  return (
    <span>
      <a
        className="text-primary underline underline-offset-4"
        href={partner.referralUrl || partner.officialUrl}
        target="_blank"
        rel={partner.referralUrl ? "sponsored noopener noreferrer" : "noopener noreferrer"}
      >
        {partner.name}
        {partner.referralUrl ? " (referral link)" : ""}
      </a>
      {partner.referralUrl && (
        <span className="mt-2 block text-sm text-muted">
          x3star may receive rewards when you use this referral link. The provider sets eligibility
          and reward terms.
        </span>
      )}
    </span>
  );
}
