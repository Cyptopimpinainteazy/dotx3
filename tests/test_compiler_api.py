import http.client
import hashlib
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
        self.assertEqual(manifest['commit'], '184b6d17f61bd576eee34f6cad25b9e4256aa29e')
        self.assertEqual(manifest, json.loads((ROOT / 'public/x3lang-port.json').read_text()))


sync_spec = importlib.util.spec_from_file_location('sync_x3lang', ROOT / 'scripts/sync-x3lang.py')
sync = importlib.util.module_from_spec(sync_spec)
sync_spec.loader.exec_module(sync)


class GuardPortTransformation(unittest.TestCase):
    def setUp(self):
        self.output = (ROOT / 'public/labs/guard/index.html').read_bytes()
        self.manifest = json.loads((ROOT / 'x3lang-port.json').read_text())
        self.row = next(row for row in self.manifest['files']
                        if row['destination'] == 'public/labs/guard/index.html')
        self.upstream = sync.remove_export_controls(self.output)
        for old, new in sync.GUARD_VERDICT_REPLACEMENTS.items():
            self.upstream = self.upstream.replace(new.encode(), old.encode())

    def test_transformation_reproduces_pinned_artifact_and_provenance(self):
        self.assertEqual(hashlib.sha256(self.upstream).hexdigest(), self.row['source_sha256'])
        output, transformations = sync.transform_ported_file(
            self.row['source'], self.upstream, self.manifest['commit'])
        self.assertEqual(output, self.output)
        self.assertEqual(hashlib.sha256(output).hexdigest(), self.row['sha256'])
        self.assertEqual(transformations, self.row['local_transformations'])

    def test_changed_missing_or_duplicated_verdict_requires_review(self):
        for old in sync.GUARD_VERDICT_REPLACEMENTS:
            for source in [self.upstream.replace(old.encode(), b'New upstream verdict'),
                           self.upstream + old.encode()]:
                with self.subTest(old=old, source_length=len(source)):
                    with self.assertRaisesRegex(ValueError, 'review before syncing'):
                        sync.transform_ported_file(self.row['source'], source, self.manifest['commit'])

    def test_unrelated_source_is_preserved(self):
        raw = b'No local modifications are authorized for this module.\n'
        self.assertEqual(sync.transform_ported_file('x3-lang/cli.py', raw, 'abc'), (raw, []))


class AttackPortTransformation(unittest.TestCase):
    def setUp(self):
        self.output = (ROOT / 'public/labs/attack/attack-lab.html').read_bytes()
        manifest = json.loads((ROOT / 'x3lang-port.json').read_text())
        self.commit = manifest['commit']
        self.row = next(row for row in manifest['files']
                        if row['destination'] == 'public/labs/attack/attack-lab.html')
        prefix = ('https://github.com/Cyptopimpinainteazy/x3lang/blob/' + self.commit).encode()
        self.upstream = sync.remove_export_controls(self.output).replace(
            prefix + b'/evidence/', b'../../evidence/').replace(
            prefix + b'/docs/hackathon/FIRST_SWAP_JUDGE_WALKTHROUGH.md',
            b'FIRST_SWAP_JUDGE_WALKTHROUGH.md').replace(
            b'from a clone of the X3Lang source repository, serve its root',
            b'from a clone of this repository, serve its root')

    def test_instruction_clarification_is_reproducible_from_pinned_source(self):
        self.assertEqual(hashlib.sha256(self.upstream).hexdigest(), self.row['source_sha256'])
        output, transformations = sync.transform_ported_file(
            self.row['source'], self.upstream, self.commit)
        self.assertEqual(output, self.output)
        self.assertEqual(transformations, self.row['local_transformations'])

    def test_changed_source_instructions_require_review(self):
        changed = self.upstream.replace(b'from a clone of this repository', b'other instructions')
        with self.assertRaisesRegex(ValueError, 'review before syncing'):
            sync.transform_ported_file(self.row['source'], changed, self.commit)


class QuoteModePortTransformation(unittest.TestCase):
    def test_reviewed_upstream_fix_is_preserved_and_drift_requires_review(self):
        manifest = json.loads((ROOT / 'x3lang-port.json').read_text())
        for row in manifest['files']:
            expected = sync.REVIEWED_QUOTE_MODE_SOURCES.get(row['source'])
            if not expected:
                continue
            output = (ROOT / row['destination']).read_bytes()
            self.assertEqual(hashlib.sha256(output).hexdigest(), expected)
            self.assertEqual(row['source_sha256'], expected)
            rebuilt, transformations = sync.transform_ported_file(row['source'], output, manifest['commit'])
            self.assertEqual(rebuilt, output)
            self.assertEqual(transformations, [])
            self.assertNotIn('local_transformations', row)
            with self.assertRaisesRegex(ValueError, 'review before syncing'):
                sync.transform_ported_file(row['source'], output + b'\n// Unreviewed drift\n', manifest['commit'])

    def test_legacy_unpatched_sources_still_receive_exact_boolean_binding(self):
        for source, replacements in sync.QUOTE_MODE_BINDING_REPLACEMENTS.items():
            unpatched = '\n'.join(replacements).encode()
            patched, transformations = sync.transform_ported_file(source, unpatched, 'legacy')
            for replacement in replacements.values():
                self.assertIn(replacement.encode(), patched)
            self.assertEqual(transformations, [sync.QUOTE_MODE_BINDING_TRANSFORMATION])
            with self.assertRaisesRegex(ValueError, 'review before syncing'):
                sync.transform_ported_file(source, patched, 'legacy')


class JudgeMainnetPortTransformation(unittest.TestCase):
    def test_evidence_note_is_reproducible_from_pinned_source(self):
        manifest = json.loads((ROOT / 'x3lang-port.json').read_text())
        row = next(row for row in manifest['files'] if row['source'] == 'x3-lang/near/demo/judge.html')
        output = (ROOT / row['destination']).read_bytes()
        updated = sync.judge_mainnet_update(manifest['commit']).encode()
        source = sync.remove_export_controls(output).replace(updated, sync.JUDGE_MAINNET_PENDING.encode()).replace(
            sync.JUDGE_SCENARIO_NOTE.encode(), sync.JUDGE_SCENARIO_BOUNDARY.encode())
        for old, new in sync.JUDGE_SETUP_COPY_REPLACEMENTS.items():
            source = source.replace(new.encode(), old.encode())
        for old, new in sync.JUDGE_LAYOUT_REPLACEMENTS.items():
            source = source.replace(new.encode(), old.encode())
        self.assertEqual(hashlib.sha256(source).hexdigest(), row['source_sha256'])
        rebuilt, transformations = sync.transform_ported_file(row['source'], source, manifest['commit'])
        self.assertEqual(rebuilt, output)
        self.assertEqual(transformations, row['local_transformations'])
        with self.assertRaisesRegex(ValueError, 'review before syncing'):
            sync.transform_ported_file(row['source'], source.replace(sync.JUDGE_MAINNET_PENDING.encode(), b''), manifest['commit'])


class MainnetSetupPortTransformation(unittest.TestCase):
    def test_current_code_pin_is_reproducible_and_unknown_source_requires_review(self):
        manifest = json.loads((ROOT / 'x3lang-port.json').read_text())
        row = next(row for row in manifest['files']
                   if row['source'] == 'x3-lang/near/demo/judge/mainnet-setup.mjs')
        output = (ROOT / row['destination']).read_bytes()
        source = output
        for old, new in sync.MAINNET_SETUP_REPLACEMENTS.items():
            source = source.replace(new.encode(), old.encode())
        self.assertEqual(hashlib.sha256(source).hexdigest(), row['source_sha256'])
        rebuilt, transformations = sync.transform_ported_file(row['source'], source, manifest['commit'])
        self.assertEqual(rebuilt, output)
        self.assertEqual(transformations, row['local_transformations'])
        with self.assertRaisesRegex(ValueError, 'review before syncing'):
            sync.transform_ported_file(row['source'], source.replace(
                b'GRy6z84ucCR9WMVXyepibVDC34TyKwjWtEi9rteKJtny', b'unreviewed'), manifest['commit'])


if __name__ == '__main__':
    unittest.main()
