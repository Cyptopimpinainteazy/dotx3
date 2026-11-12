import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as lab from '../public/labs/guard/x3guard.mjs';
import * as playground from '../src/lib/x3/vendor/x3guard.mjs';

// A captured provider-signed dry quote: no signing, providers, or wallets in this test.
const captured = JSON.parse(readFileSync(new URL(
  '../src/lib/x3/vendor/fixtures/near_intents_quote_dry_live_capture.json', import.meta.url), 'utf8'));
const leg = {amount: captured.quote.amountIn, min_receive: captured.quote.minAmountOut,
  slippage_bps: 50, fee_cap_bps: 1000, deadline: captured.quoteRequest.deadline};
const nowMs = Date.parse(captured.timestamp);

for (const [name, checker] of [['lab', lab], ['playground', playground]]) {
  test(`${name}: the captured dry quote remains a dry pass`, async () => {
    const result = await checker.verifyQuote(leg, captured.quoteRequest, captured, {nowMs});
    assert.equal(result.verdict, 'dry_pass');
  });

  test(`${name}: a valid dry signature cannot authorize unsigned live deposit fields`, async () => {
    const response = structuredClone(captured);
    Object.assign(response.quote, {depositAddress: '11111111111111111111111111111111',
      depositMemo: 'test-only', deadline: captured.quoteRequest.deadline, timeEstimate: 1, refundFee: '1'});
    assert.equal((await checker.checkQuoteSignature(response)).valid, true,
      'dry signatures intentionally exclude these optional live quote fields');
    const result = await checker.verifyQuote(leg, {...captured.quoteRequest, dry: false}, response, {nowMs});
    assert.equal(result.verdict, 'refused');
    const echo = result.results.find(row => row.guard === 'quote_request_echo');
    assert.equal(echo.ok, false);
    assert.ok(echo.mismatched.includes('dry'));
  });

  test(`${name}: missing or nonboolean request modes fail closed`, async () => {
    for (const dry of [undefined, null, 0, 1, 'false', 'true']) {
      const request = {...captured.quoteRequest, dry};
      if (dry === undefined) delete request.dry;
      const result = await checker.verifyQuote(leg, request, captured, {nowMs});
      assert.equal(result.verdict, 'refused');
      assert.ok(result.results.find(row => row.guard === 'quote_request_echo').mismatched.includes('dry'));
    }
  });
}
