/** Export public article content only; never copy input values or private widgets. */
export function pageMarkdown(root: Element, url: string): string {
  const copy = root.cloneNode(true) as Element;
  copy
    .querySelectorAll(
      'script,style,nav,footer,button,input,textarea,select,[data-copy-exclude],[hidden],[aria-hidden="true"]',
    )
    .forEach((el) => el.remove());
  copy
    .querySelectorAll("pre")
    .forEach((el) => el.replaceWith(`\n\n\`\`\`\n${el.textContent || ""}\n\`\`\`\n\n`));
  copy.querySelectorAll("a[href]").forEach((el) => {
    const href = el.getAttribute("href") || "";
    try {
      const link = new URL(href, url);
      if (["http:", "https:"].includes(link.protocol))
        el.replaceWith(`[${el.textContent?.trim()}](${link.href})`);
    } catch {
      /* keep readable label */
    }
  });
  copy
    .querySelectorAll("h1,h2,h3,h4,h5,h6")
    .forEach((el) =>
      el.replaceWith(`\n\n${"#".repeat(Number(el.tagName[1]))} ${el.textContent}\n\n`),
    );
  copy.querySelectorAll("tr").forEach((el) =>
    el.replaceWith(
      `\n| ${Array.from(el.children)
        .map((cell) => cell.textContent?.trim())
        .join(" | ")} |\n`,
    ),
  );
  copy.querySelectorAll("li").forEach((el) => el.prepend("\n- "));
  copy.querySelectorAll("p,section,article,div,dl,details").forEach((el) => {
    el.prepend("\n");
    el.append("\n");
  });
  copy
    .querySelectorAll("iframe")
    .forEach((el) =>
      el.replaceWith(`\nEmbedded content: ${new URL(el.getAttribute("src") || "", url).href}\n`),
    );
  return `${copy.textContent?.replace(/\n{3,}/g, "\n\n").trim()}\n\nSource: ${url}\n`;
}
