import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chromium } from "playwright";

const base = new URL(process.argv[2] || "http://127.0.0.1:8080");
assert.ok(
  ["localhost", "127.0.0.1"].includes(base.hostname),
  "Use the local site with the real compiler proxy",
);
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(new URL("/labs", base).href);
  await page.waitForFunction(() =>
    document.querySelector('textarea[aria-label="program"]')?.value.includes("intent "),
  );
  const original = await page.getByRole("textbox", { name: "program", exact: true }).inputValue();
  async function run(button, decision) {
    const responsePromise = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === "/api/compile" &&
        response.request().method() === "POST",
    );
    await page.getByRole("button", { name: button, exact: true }).click();
    const response = await responsePromise;
    assert.equal(response.status(), 200);
    const report = await response.json();
    assert.equal(report.decision, decision);
    assert.equal(report.wallet_authorized, false);
    assert.equal(report.onchain_authorization_verified, false);
    assert.equal(report.settlement_proven, false);
    assert.equal(
      report.program_sha256,
      createHash("sha256")
        .update(await page.getByRole("textbox", { name: "program", exact: true }).inputValue())
        .digest("hex"),
    );
    await page.getByRole("button", { name: "Compile & check policy", exact: true }).waitFor();
    return report;
  }
  await run("Compile & check policy", "preflight_passed");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download review packet", exact: true }).click();
  assert.equal((await downloadPromise).suggestedFilename(), "dotx3-review.json");
  const denied = await run("Try recipient attack", "denied_by_policy");
  assert.deepEqual(denied.policy.denied_guards, ["mandate_recipient"]);
  await page.getByRole("button", { name: "Restore intent", exact: true }).click();
  assert.equal(
    await page.getByRole("textbox", { name: "program", exact: true }).inputValue(),
    original,
  );
  const invalid = await run("Remove nonce & compile", "compile_error");
  assert.equal(invalid.error.code, "X3_NEAR_NONCE");
  await page.getByRole("textbox", { name: "program", exact: true }).fill(original);
  await page.getByRole("heading", { name: "No current decision", exact: true }).waitFor();
  await page.getByRole("tab", { name: "Coin Studio", exact: true }).click();
  await page.getByRole("button", { name: "Generate coin artifacts" }).click();
  await page.getByRole("region", { name: "Generated artifacts" }).waitFor();
  assert.match(
    await page.getByLabel("Coin declaration", { exact: true }).inputValue(),
    /coin DEMO/,
  );
  for (const [label, name] of [
    ["Download .x3 source", "coin.x3"],
    ["Download Solidity", "X3IssuedCoin.sol"],
    ["Download SPL issuance plan", "spl-issuance.json"],
    ["Download manifest", "coin-manifest.json"],
  ]) {
    const downloaded = page.waitForEvent("download");
    await page.getByRole("button", { name: label, exact: true }).click();
    assert.equal((await downloaded).suggestedFilename(), name);
  }
  await page.getByLabel("Coin declaration", { exact: true }).fill("coin BAD {");
  assert.equal(await page.getByRole("region", { name: "Generated artifacts" }).count(), 0);
  await page.getByRole("button", { name: "Build from source" }).click();
  await page.getByRole("alert").waitFor();

  await page.getByRole("tab", { name: "Ten-network sale", exact: true }).click();
  await page.getByRole("button", { name: "Preview purchase" }).click();
  await page.getByRole("heading", { name: "100 tokens to the buyer on Ethereum" }).waitFor();
  assert.equal(await page.getByRole("table").locator("tbody tr").count(), 10);
  assert.deepEqual(
    await page.getByRole("table").locator("tbody tr td:first-of-type").allTextContents(),
    Array(10).fill("10"),
  );
  await page.getByLabel("Tokens to buy on Ethereum").fill("0.000001");
  await page.getByRole("button", { name: "Preview purchase" }).click();
  await page.getByRole("alert").filter({ hasText: "split equally" }).waitFor();
  assert.equal(await page.getByRole("table").count(), 0);
  await page.getByRole("tab", { name: "Attack lab", exact: true }).click();
  await page
    .frameLocator('iframe[title="Attack lab"]')
    .getByRole("button", { name: "Run all scenarios" })
    .click();
  await page
    .frameLocator('iframe[title="Attack lab"]')
    .locator("#summary")
    .filter({ hasText: "9/9 attacks blocked · 1/1 legit payment allowed" })
    .waitFor();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: real compiler allowed/recipient-denied/nonce-error, source hashes, review download, stale-result clearing coin authoring and downloads, ten-network quotes and embedded Attack Lab",
  );
} finally {
  await browser.close();
}
