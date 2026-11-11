/** Shared public-page exporter. public/page-export.mjs is a byte-identical static copy. */
/** @param {string[][]} rows @param {boolean} hasHeader */
export function markdownTable(rows, hasHeader) {
  if (!rows.length) return "";
  const width = Math.max(...rows.map((row) => row.length));
  /** @param {string} value */
  const escape = (value) => value.replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
  /** @param {string[]} row */
  const line = (row) =>
    `| ${Array.from({ length: width }, (_, i) => escape(row[i] || "")).join(" | ")} |`;
  const header = hasHeader ? rows[0] : Array.from({ length: width }, (_, i) => `Column ${i + 1}`);
  return `\n\n${[line(header), line(Array(width).fill("---")), ...(hasHeader ? rows.slice(1) : rows).map(line)].join("\n")}\n\n`;
}

/** Exports public article text only, never form values or excluded wallet/private regions.
 * @param {Element} root @param {string} url
 */
export function pageMarkdown(root, url) {
  const copy = /** @type {Element} */ (root.cloneNode(true));
  copy
    .querySelectorAll(
      'script,style,nav,[role="navigation"],footer,button,input,textarea,select,[data-copy-exclude],[hidden],[aria-hidden="true"]',
    )
    .forEach((el) => el.remove());
  copy.querySelectorAll("pre").forEach((el) => {
    const text = el.textContent || "";
    const longest = Math.max(2, ...(text.match(/`+/g) || []).map((run) => run.length));
    const fence = "`".repeat(longest + 1);
    el.replaceWith(`\n\n${fence}\n${text}\n${fence}\n\n`);
  });
  copy.querySelectorAll("a[href]").forEach((el) => {
    try {
      const link = new URL(el.getAttribute("href") || "", url);
      if (["http:", "https:"].includes(link.protocol))
        el.replaceWith(`[${el.textContent?.trim()}](${link.href})`);
    } catch {
      /* Preserve the readable label. */
    }
  });
  copy
    .querySelectorAll("h1,h2,h3,h4,h5,h6")
    .forEach((el) =>
      el.replaceWith(`\n\n${"#".repeat(Number(el.tagName[1]))} ${el.textContent}\n\n`),
    );
  copy.querySelectorAll("table").forEach((table) => {
    const rows = Array.from(table.querySelectorAll("tr")).filter(
      (row) => row.closest("table") === table,
    );
    const values = rows.map((row) =>
      Array.from(row.children).map((cell) => cell.textContent?.trim() || ""),
    );
    table.replaceWith(markdownTable(values, Boolean(rows[0]?.querySelector("th"))));
  });
  copy.querySelectorAll("li").forEach((el) => el.prepend("\n- "));
  copy.querySelectorAll("p,section,article,div,dl,details").forEach((el) => {
    el.prepend("\n");
    el.append("\n");
  });
  copy.querySelectorAll("iframe").forEach((el) => {
    try {
      el.replaceWith(`\nEmbedded content: ${new URL(el.getAttribute("src") || "", url).href}\n`);
    } catch {
      el.replaceWith("\nEmbedded content unavailable\n");
    }
  });
  return `${copy.textContent?.replace(/\n{3,}/g, "\n\n").trim()}\n\nSource: ${url}\n`;
}

/** @param {string} content @param {string} pathname */
export function downloadMarkdown(content, pathname) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/markdown;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = (pathname.replaceAll("/", "-").replace(/^-|-$|[^a-z0-9-]/gi, "") || "home") + ".md";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
