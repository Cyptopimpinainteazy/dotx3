import http.client
from http.server import ThreadingHTTPServer
import importlib.util
import json
from pathlib import Path
from threading import Thread
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('compiler_api', ROOT / 'api/compile.py')
api = importlib.util.module_from_spec(spec)
spec.loader.exec_module(api)


class CompilerAPI(unittest.TestCase):
    def setUp(self):
        self.server = ThreadingHTTPServer(('127.0.0.1', 0), api.handler)
        self.thread = Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()

    def post(self, payload, headers=None):
        connection = http.client.HTTPConnection('127.0.0.1', self.server.server_port)
        connection.request('POST', '/api/compile', json.dumps(payload),
            headers or {'Content-Type': 'application/json'})
        response = connection.getresponse()
        code, data = response.status, json.loads(response.read())
        connection.close()
        return code, data

    def test_three_real_compiler_outcomes(self):
        example = json.loads((ROOT / 'public/labs/compiler/examples.json').read_text())
        for program, decision in [
            (example['program'], 'preflight_passed'),
            (example['program'].replace('to Near.USDC receiver x3-demo.near',
                'to Near.USDC receiver attacker.near'), 'denied_by_policy'),
            (example['program'].replace('    require nonce unused agent_payment_001\n', ''), 'compile_error'),
        ]:
            code, report = self.post({**example, 'program': program})
            self.assertEqual(code, 200)
            self.assertEqual(report['decision'], decision)
            self.assertFalse(report['wallet_authorized'])
            self.assertFalse(report['settlement_proven'])

    def test_cross_origin_and_invalid_inputs_fail(self):
        self.assertEqual(self.post({}, {'Content-Type': 'application/json',
            'Origin': 'https://evil.example'})[0], 403)
        self.assertEqual(self.post([])[0], 400)
        self.assertEqual(self.post({'program': 'x' * 32769, 'mandate': 'x'})[0], 400)

    def test_ported_file_digests(self):
        manifest = json.loads((ROOT / 'x3lang-port.json').read_text())
        import hashlib
        for row in manifest['files']:
            self.assertEqual(hashlib.sha256((ROOT / row['destination']).read_bytes()).hexdigest(), row['sha256'])
        self.assertEqual(manifest['commit'], 'a120169cb41e8e30f7a5fd4002de2506388137b2')


if __name__ == '__main__':
    unittest.main()
