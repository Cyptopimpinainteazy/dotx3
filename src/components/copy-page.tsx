import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { pageMarkdown } from "@/lib/copy-page";
export function CopyPage() {
  const [message, setMessage] = useState("");
  function content() {
    const root = document.querySelector("[data-page-content]");
    if (!root) throw Error();
    return pageMarkdown(root, location.origin + location.pathname);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(content());
      setMessage("Copied page");
    } catch {
      setMessage("Clipboard unavailable. Download this page instead.");
    }
  }
  function download() {
    try {
      const url = URL.createObjectURL(
        new Blob([content()], { type: "text/markdown;charset=utf-8" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download =
        (location.pathname.replaceAll("/", "-").replace(/^-|-$|[^a-z0-9-]/gi, "") || "home") +
        ".md";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("Page downloaded");
    } catch {
      setMessage("Page content is unavailable.");
    }
  }
  return (
    <div data-copy-exclude className="flex flex-wrap items-center justify-center gap-3 text-sm">
      <button
        type="button"
        onClick={copy}
        className="tap inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 hover:border-primary"
      >
        {message === "Copied page" ? <Check size={16} /> : <Copy size={16} />}Copy page
      </button>
      <button
        type="button"
        onClick={download}
        className="tap inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 hover:border-primary"
      >
        <Download size={16} />
        Download Markdown
      </button>
      <span role="status" aria-live="polite" className="text-muted">
        {message}
      </span>
    </div>
  );
}
