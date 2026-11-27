"""Verify the coin compiler and examples pinned independently of the trading workbench."""
import hashlib
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class CoinSources(unittest.TestCase):
    def test_reviewed_coin_artifacts(self):
        manifest = json.loads((ROOT / "public/labs/coin-sources.json").read_text())
        self.assertEqual(manifest["repository"], "Cyptopimpinainteazy/x3lang")
        self.assertRegex(manifest["commit"], r"^[a-f0-9]{40}$")
        for entry in manifest["files"]:
            with self.subTest(path=entry["source"]):
                self.assertEqual(entry["destination"], "vendor/x3lang/" + entry["source"])
                raw = (ROOT / entry["destination"]).read_bytes()
                self.assertEqual(hashlib.sha256(raw).hexdigest(), entry["sha256"])
