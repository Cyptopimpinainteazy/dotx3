import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const base = new URL(process.argv[2] || "http://127.0.0.1:8080");
assert.ok(["localhost", "127.0.0.1"].includes(base.hostname), "Use a local preview");
const output = process.argv[3] || "/tmp/dotx3-near-smoke";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const results = [];
try {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const [path, heading] of [
      ["/near", "One policy. Three track perspectives."],
      ["/labs", "Write it. Challenge it. Inspect the rule."],
      ["/security", "AI Security & Defense"],
      ["/agents", "Agent Economy"],
      ["/defi", "Unstoppable DeFi"],
      ["/docs", "Write the rule. The agent does not get to waive it."],
      ["/developers", "Get the website and language tools."],
    ]) {
      const response = await page.goto(new URL(path, base).href);
      assert.equal(response.status(), 200, path);
      await page.getByRole("heading", { name: heading, exact: true }).waitFor();
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${path} overflow at ${viewport.width}`,
      );
      if (path === "/near") {
        const links = page.getByRole("link", { name: "Explore track", exact: true });
        assert.equal(await links.count(), 3);
        assert.deepEqual(
          await links.evaluateAll((items) => items.map((item) => item.getAttribute("href"))),
          ["/security", "/agents", "/defi"],
        );
      }
      if (viewport.width === 390) {
        await page.getByRole("button", { name: "Open menu", exact: true }).click();
      }
      await page.getByRole("link", { name: "NEAR Competition", exact: true }).click();
      await page
        .getByRole("heading", { name: "One policy. Three track perspectives.", exact: true })
        .waitFor();
      results.push({ path, width: viewport.width, status: "pass" });
    }
    await page.waitForFunction(
      () => getComputedStyle(document.querySelector("h1")).opacity === "1",
    );
    await page.screenshot({ path: `${output}/near-${viewport.width}.png`, fullPage: true });
    await page.goto(new URL("/labs", base).href);
    await page.getByRole("link", { name: "Open Attack Lab", exact: true }).click();
    await page.getByRole("button", { name: "Run all scenarios" }).click();
    await page
      .locator("#summary")
      .filter({ hasText: "9/9 attacks blocked · 1/1 legit payment allowed" })
      .waitFor();
    await page.locator('button[data-id="allowed"]').click();
    assert.match(await page.locator("#verdict").innerText(), /POLICY_PREVIEW_ALLOWED/);
    await page.getByRole("button", { name: "Submit request (offline)", exact: true }).click();
    assert.match(await page.locator("#verdict").innerText(), /NONCE_REPLAY/);
    assert.equal(await page.locator("#spent-text").innerText(), "0.1 / 0.4 NEAR spent");
    assert.ok(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `Attack Lab overflow at ${viewport.width}`,
    );
    await page.screenshot({ path: `${output}/attack-${viewport.width}.png`, fullPage: true });
    results.push({
      path: "/labs/attack/attack-lab.html",
      width: viewport.width,
      status: "pass",
      scenarios: 10,
      replay: "refused",
    });
    assert.deepEqual(errors, []);
    await page.close();
  }
  writeFileSync(`${output}/result.json`, JSON.stringify({ ok: true, results }, null, 2));
  console.log(
    `PASS: ${results.length} route/viewport checks, all Attack Lab scenarios and replay, track links, navigation, no overflow or page errors`,
  );
} finally {
  await browser.close();
}
