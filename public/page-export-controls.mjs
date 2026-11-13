import { pageMarkdown, downloadMarkdown } from "./page-export.mjs";
for (const controls of document.querySelectorAll("[data-page-export-controls]")) {
  const status = controls.querySelector('[role="status"]');
  const content = () =>
    pageMarkdown(
      document.querySelector("[data-page-content]") || document.body,
      location.origin + location.pathname,
    );
  controls.querySelector("[data-export-copy]").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(content());
      status.textContent = "Copied page";
    } catch {
      status.textContent = "Clipboard unavailable. Download this page instead.";
    }
  });
  controls.querySelector("[data-export-download]").addEventListener("click", () => {
    try {
      downloadMarkdown(content(), location.pathname);
      status.textContent = "Page downloaded";
    } catch {
      status.textContent = "Page content is unavailable.";
    }
  });
}
