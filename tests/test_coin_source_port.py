"""Verify the coin compiler and examples pinned independently of the trading workbench."""
import hashlib
import json
import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class CoinSources(unittest.TestCase):
    def test_reviewed_coin_artifacts(self):
        manifest = json.loads((ROOT / "public/labs/coin-sources.json").read_text())
        self.assertEqual(manifest["repository"], "Cyptopimpinainteazy/x3lang")
        compiler = json.loads((ROOT / "x3lang-port.json").read_text())
        self.assertEqual(manifest["commit"], compiler["commit"])
        for entry in manifest["files"]:
            with self.subTest(path=entry["source"]):
                self.assertEqual(entry["destination"], "vendor/x3lang/" + entry["source"])
                raw = (ROOT / entry["destination"]).read_bytes()
                self.assertEqual(hashlib.sha256(raw).hexdigest(), entry["sha256"])

    def test_keccak_rate_boundary(self):
        path = ROOT / "vendor/x3lang/x3-lang/emitter/_keccak.py"
        spec = importlib.util.spec_from_file_location("vendored_keccak", path)
        keccak = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(keccak)
        # Cross-checked against ethers.keccak256 in the upstream coin evidence suite.
        for size, expected in [
            (134, "e5de5653994e2fa6729d329b65b5f332dee942a7ea54515e173824c232a4ff91"),
            (135, "34367dc248bbd832f4e3e69dfaac2f92638bd0bbd18f2912ba4ef454919cf446"),
            (136, "a6c4d403279fe3e0af03729caada8374b5ca54d8065329a3ebcaeb4b60aa386e"),
            (271, "132f47effd6c8b1b299efa53fe68aece77ec8ae4eb2e294f668eec94f76001e1"),
        ]:
            with self.subTest(size=size):
                self.assertEqual(keccak.keccak_256(b"a" * size).hex(), expected)
