// Runs under `node --experimental-strip-types --test` (see package.json `test`).
//
// The header dropdowns, mobile menu and footer all render NAV. These tests fail if a menu
// item points at a route that does not exist, a section that was renamed, or a public file
// that is missing, so no menu entry can quietly become a dead link.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ALL_NAV, NAV, NAV_CTA, groupContainsPath, isCurrentPage, slugify } from "./site-nav.ts";
import { BACKING_LINKS_VISIBLE } from "./front-door.ts";

const ROOT = join(import.meta.dirname, "..", "..");

function routeFile(to: string): string {
  const name = to === "/" ? "index" : to.replace(/^\//, "");
  return join(ROOT, "src", "routes", `${name}.tsx`);
}

/** Section ids a route renders. TrackPage routes render the shared track template. */
function sectionIds(to: string): Set<string> {
  let source = readFileSync(routeFile(to), "utf8");
  if (source.includes("<TrackPage")) {
    source += readFileSync(join(ROOT, "src", "components", "track-page.tsx"), "utf8");
  }
  const ids = new Set<string>();
  for (const match of source.matchAll(/<Section\b([\s\S]*?)>/g)) {
    const attrs = match[1];
    const explicit = attrs.match(/\bid="([^"]+)"/);
    const title = attrs.match(/\btitle="([^"]+)"/);
    if (explicit) ids.add(explicit[1]);
    else if (title) ids.add(slugify(title[1]));
  }
  return ids;
}

const items = ALL_NAV.flatMap((group) => group.items.map((item) => ({ group: group.id, item })));

test("slugify makes stable, url-safe section ids", () => {
  assert.equal(slugify("Proof meter"), "proof-meter");
  assert.equal(slugify("What .x3 does"), "what-x3-does");
  assert.equal(slugify("Builders, grants and partners"), "builders-grants-and-partners");
  assert.equal(slugify("AI Security & Defense"), "ai-security-and-defense");
  assert.equal(slugify("1Click integration"), "1click-integration");
  assert.equal(slugify("  --Edge--  "), "edge");
});

test("every route item has a route file", () => {
  for (const { item } of items) {
    if (item.kind !== "route") continue;
    assert.ok(existsSync(routeFile(item.to)), `${item.label}: no route file for ${item.to}`);
  }
  assert.ok(existsSync(routeFile(NAV_CTA.to)), "CTA route missing");
});

test("every section link matches a Section on its page", () => {
  for (const { item } of items) {
    if (item.kind !== "route" || !item.hash) continue;
    const ids = sectionIds(item.to);
    assert.ok(
      ids.has(item.hash),
      `${item.label}: #${item.hash} is not a section on ${item.to} (has: ${[...ids].join(", ")})`,
    );
  }
});

test("every file item exists in public/", () => {
  for (const { item } of items) {
    if (item.kind !== "file") continue;
    assert.ok(existsSync(join(ROOT, "public", item.href)), `${item.label}: missing ${item.href}`);
  }
});

test("external items are https and none repeats within a group", () => {
  for (const group of ALL_NAV) {
    const seen = new Set<string>();
    for (const item of group.items) {
      const key = item.kind === "route" ? `${item.to}#${item.hash ?? ""}` : item.href;
      assert.ok(!seen.has(key), `${group.id}: duplicate entry ${key}`);
      seen.add(key);
      if (item.kind === "external") assert.match(item.href, /^https:\/\/[^\s]+$/);
      assert.ok(item.label.trim() && item.description.trim(), `${group.id}: empty text`);
    }
  }
});

test("group ids are unique and every top-level page is reachable", () => {
  assert.equal(new Set(ALL_NAV.map((g) => g.id)).size, ALL_NAV.length);
  const shown = NAV.flatMap((group) => group.items);
  const linked = new Set(shown.flatMap((item) => (item.kind === "route" ? [item.to] : [])));
  // /proofs is intentionally unlinked; see the audit notes in the PR.
  for (const page of [
    "/near",
    "/security",
    "/agents",
    "/defi",
    "/demo",
    "/playground",
    "/labs",
    "/dex",
    "/learn",
    "/docs",
    "/language",
    "/bootcamp",
    "/proof",
    "/developers",
    ...(BACKING_LINKS_VISIBLE ? ["/back"] : []),
  ]) {
    assert.ok(linked.has(page as never), `${page} is not in the menu`);
  }
});

test("current-page and group highlighting ignore section jumps and home", () => {
  const docs = NAV.find((g) => g.id === "learn")!;
  const docsPage = docs.items.find((i) => i.kind === "route" && i.to === "/docs" && !i.hash)!;
  const docsHash = docs.items.find((i) => i.kind === "route" && i.hash === "syntax")!;
  assert.equal(isCurrentPage(docsPage, "/docs"), true);
  assert.equal(isCurrentPage(docsHash, "/docs"), false);
  assert.equal(groupContainsPath(docs, "/docs"), true);
  const hackathon = NAV.find((g) => g.id === "hackathon")!;
  assert.equal(groupContainsPath(hackathon, "/"), false);
});

test("BACKING_LINKS_VISIBLE controls every /back link in the menus", () => {
  const backLinks = NAV.flatMap((g) => g.items).filter(
    (i) => i.kind === "route" && i.to === "/back",
  );
  assert.equal(
    NAV.some((g) => g.id === "back"),
    BACKING_LINKS_VISIBLE,
  );
  if (!BACKING_LINKS_VISIBLE) assert.equal(backLinks.length, 0, "a /back link is still shown");
  // The hidden group is kept intact so flipping the flag restores it.
  assert.ok(ALL_NAV.find((g) => g.id === "back")!.items.length > 0);
});
