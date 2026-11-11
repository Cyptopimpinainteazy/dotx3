import { useState } from "react";
import { pageMarkdown, downloadMarkdown } from "../../../src/lib/page-export.mjs";
export default function PageExport() {
  const [message, setMessage] = useState("");
  const content = () => {
    const root = document.querySelector("[data-dex-page-content]");
    if (!root) throw Error("Page unavailable");
    return pageMarkdown(root, location.origin + location.pathname);
  };
  return (
    <div
      data-copy-exclude
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "center",
        padding: "0 0 18px",
      }}
    >
      <button
        type="button"
        className="lab-button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(content());
            setMessage("Copied page");
          } catch {
            setMessage("Clipboard unavailable. Download this page instead.");
          }
        }}
      >
        Copy page
      </button>
      <button
        type="button"
        className="lab-button"
        onClick={() => {
          try {
            downloadMarkdown(content(), location.pathname);
            setMessage("Page downloaded");
          } catch {
            setMessage("Page content is unavailable.");
          }
        }}
      >
        Download Markdown
      </button>
      <span role="status" aria-live="polite">
        {message}
      </span>
    </div>
  );
}
