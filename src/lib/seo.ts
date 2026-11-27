const SITE_ORIGIN = "https://dotx3.net";

/** Public page URLs are independent of preview hosts and tracking parameters. */
export function canonicalLink(path: string) {
  return { rel: "canonical", href: `${SITE_ORIGIN}${path}` };
}

export function pageSeo(path: string, title: string, description: string) {
  return {
    meta: [{ title }, { name: "description", content: description }],
    links: [canonicalLink(path)],
  };
}
