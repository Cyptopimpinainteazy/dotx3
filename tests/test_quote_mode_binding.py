"""Offline regression: a provider-signed dry quote must never become live authority."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('mode_adapter', ROOT / 'vendor/x3lang/x3-lang/near_intents.py')
adapter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(adapter)
CAPTURED = json.loads((ROOT / 'src/lib/x3/vendor/fixtures/near_intents_quote_dry_live_capture.json').read_text())
LEG = {'amount': int(CAPTURED['quote']['amountIn']),
       'min_receive': int(CAPTURED['quote']['minAmountOut']),
       'slippage_bps': 50, 'fee_cap_bps': 1000,
       'deadline': CAPTURED['quoteRequest']['deadline']}
NOW = adapter.parse_timestamp(CAPTURED['timestamp'])


class QuoteModeBinding(unittest.TestCase):
    def assert_mode_refused(self, request, response):
        with self.assertRaises(adapter.NearIntentsError) as failure:
            adapter.verify_quote(LEG, request, response, now=NOW)
        self.assertEqual(failure.exception.code, 'X3_NEAR_GUARD_FAILED')
        echo = next(row for row in failure.exception.detail if row['guard'] == 'quote_request_echo')
        self.assertFalse(echo['ok'])
        self.assertIn('dry', echo['mismatched'])

    def test_captured_dry_quote_still_passes(self):
        result = adapter.verify_quote(LEG, CAPTURED['quoteRequest'], CAPTURED, now=NOW)
        self.assertTrue(all(row['ok'] for row in result))

    def test_unsigned_live_fields_cannot_upgrade_valid_dry_signature(self):
        response = copy.deepcopy(CAPTURED)
        response['quote'].update(depositAddress='11111111111111111111111111111111',
                                 depositMemo='test-only', deadline=LEG['deadline'], timeEstimate=1,
                                 refundFee='1')
        self.assertTrue(adapter.verify_oneclick_quote_signature(response))
        self.assert_mode_refused({**CAPTURED['quoteRequest'], 'dry': False}, response)

    def test_missing_or_nonboolean_request_modes_fail_closed(self):
        for dry in [None, 0, 1, 'false', 'true']:
            with self.subTest(dry=dry):
                self.assert_mode_refused({**CAPTURED['quoteRequest'], 'dry': dry}, CAPTURED)
        request = copy.deepcopy(CAPTURED['quoteRequest'])
        del request['dry']
        self.assert_mode_refused(request, CAPTURED)


if __name__ == '__main__':
    unittest.main()
