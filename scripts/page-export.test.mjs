import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { markdownTable } from "../src/lib/page-export.mjs";
test("Markdown tables preserve headers and escape cells", () => {
  assert.equal(
    markdownTable(
      [
        ["Rule", "Result"],
        ["a|b", "line1\nline2"],
      ],
      true,
    ),
    "\n\n| Rule | Result |\n| --- | --- |\n| a\\|b | line1<br>line2 |\n\n",
  );
});
test("headerless tables retain the first data row and normalize columns", () => {
  assert.equal(
    markdownTable([["Alice", "1"], ["Bob"]], false),
    "\n\n| Column 1 | Column 2 |\n| --- | --- |\n| Alice | 1 |\n| Bob |  |\n\n",
  );
  assert.equal(markdownTable([], false), "");
});
test("static and bundled clients use identical exporter source", () => {
  assert.equal(
    readFileSync(new URL("../public/page-export.mjs", import.meta.url), "utf8"),
    readFileSync(new URL("../src/lib/page-export.mjs", import.meta.url), "utf8"),
  );
});
test("standalone labs have accessible export controls without inline runtime injection", () => {
  for (const name of [
    "guard/index.html",
    "guard/judge.html",
    "guard/bnb.html",
    "attack/attack-lab.html",
  ]) {
    const html = readFileSync(new URL("../public/labs/" + name, import.meta.url), "utf8");
    assert.match(html, /data-copy-exclude data-page-export-controls/);
    assert.match(html, /role="status" aria-live="polite"/);
    assert.match(html, /type="module" src="\/page-export-controls.mjs"/);
    assert.match(html, /href="\/page-export.css"/);
  }
});
