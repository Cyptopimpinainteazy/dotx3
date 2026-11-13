#!/usr/bin/env python3
"""Port allowlisted X3Lang demos/compiler from a clean pinned checkout."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

GUARD_VERDICT_REPLACEMENTS = {
    'The owner\'s mandate refuses this payment (${failed === 1 ? "one term" : failed + " terms"}). 1Click was never asked for a quote, and x3-guard would refuse it on NEAR the same way.':
        'The local mandate preview refuses this payment (${failed === 1 ? "one term" : failed + " terms"}). 1Click was never asked for a quote. No on-chain Guard decision was requested or verified.',
    'Refused by ${failed.length === 1 ? "one rule" : failed.length + " rules"}. A live quote like this could not be deposited to.':
        'Refused by ${failed.length === 1 ? "one rule" : failed.length + " rules"} in this dry preview. No live quote, on-chain authorization or deposit was verified.',
    "Every rule and every term of the mandate holds. As a live quote, the agent could register and accept it on NEAR; the deposit still needs the owner's wallet.":
        'Dry quote and local mandate checks passed under the stated assumptions. Required approvals, current on-chain state, live quote deposit/deadline checks and settlement remain unverified. This is not authorization.',
    'Every rule holds. As a live quote, this would be eligible for a wallet signature, and nothing moves without one.':
        'Dry quote checks passed. Live quote deposit/deadline checks, owner approval and settlement remain unverified. This is not authorization.',
}

GUARD_TRANSFORMATION = 'Clarify dry quote and local mandate verdicts never establish live eligibility, on-chain authorization or settlement; upstream source_sha256 is retained.'

QUOTE_MODE_BINDING_TRANSFORMATION = 'Bind dry mode as an exact boolean in the signed request echo; upstream source_sha256 is retained. Local proposal pending upstream approval.'
QUOTE_MODE_BINDING_REPLACEMENTS = {
    'x3-lang/near_intents.py': {
        '_ECHO_FIELDS = (\n    "swapType",': '_ECHO_FIELDS = (\n    "dry", "swapType",',
        'def _same(field: str, sent: Any, echoed: Any) -> bool:\n':
            'def _same(field: str, sent: Any, echoed: Any) -> bool:\n'
            '    if field == "dry":\n'
            '        return type(sent) is bool and type(echoed) is bool and sent is echoed\n',
    },
    'x3-lang/near/demo/x3guard.mjs': {
        'const ECHO_FIELDS = ["swapType",': 'const ECHO_FIELDS = ["dry", "swapType",',
        'function same(field, sent, echoed) {\n':
            'function same(field, sent, echoed) {\n'
            '  if (field === "dry") return typeof sent === "boolean" && typeof echoed === "boolean" && sent === echoed;\n',
    },
}

# Reviewed at efb514ffef2cdfdeb8ad8147747887c85356073c: the upstream fix now
# includes exact-boolean dry binding. Accept these exact bytes without claiming
# a local patch. Unknown changes still require a review, including already-patched
# files with additional edits; the legacy transformation remains fail-closed.
REVIEWED_QUOTE_MODE_SOURCES = {
    'x3-lang/near_intents.py': '9ee749438c5b33d656a1ced6af771e51ec9b9e0e87cb5ef0630b2808c92040bf',
    'x3-lang/near/demo/x3guard.mjs': '063164355bd558a43b37c38b2c1baf7e3bf66302b5e0203fab3450e03ddcfe5d',
}

JUDGE_MAINNET_PENDING = (
    '    <p><strong>Pending evidence.</strong> Official mainnet swap settlement, a vault-funded payment,\n'
    '      and an on-chain hostile-model refusal.</p>'
)
JUDGE_MAINNET_TRANSFORMATION = 'Add the separately published invoice_06 mainnet settlement and remaining evidence limits to the historical setup section; upstream source_sha256 is retained.'
JUDGE_SCENARIO_BOUNDARY = 'This console asks neither 1Click nor NEAR for anything, so it has no quote, deposit address, or transaction hash to show. Official 1Click mainnet settlement evidence is outstanding.'
JUDGE_SCENARIO_NOTE = 'These local scenarios do not request a quote or create a transaction. The optional setup button reads NEAR RPC data; the published mainnet settlement above is a separate recorded run.'
JUDGE_SETUP_COPY_REPLACEMENTS = {
    '>Check mainnet setup</button>': '>Check setup and current Guard code</button>',
    '>Live RPC check ready.</p>': '>Ready to read historical setup transactions and the current Guard code.</p>',
}

# The historical setup transactions predate the reviewed upgrade. The checker
# reads current finalized account state, so compare against the deployed code
# recorded by invoice_06's November 12 public-rpc-observation.json (SHA-256
# 3e04b9fd801473a52c1f51460c406752ef898877c80bda920c32c8ddb3348be7).
MAINNET_SETUP_REPLACEMENTS = {
    'const OBSERVED_CODE = "GRy6z84ucCR9WMVXyepibVDC34TyKwjWtEi9rteKJtny";':
        'const OBSERVED_CODE = "BPdpJAw8R4SDh6Wi7dPcXTs5T7ncJDVKCLgzuqZFb15T";',
    'Checking finalized transactions and current Guard code…':
        'Checking historical setup transactions and current Guard code…',
    'RPC confirmed both setup transactions and the expected Guard code at block ${block}.':
        'RPC confirmed both historical setup transactions and the Guard code reviewed in the November 12 evidence at block ${block}.',
}
MAINNET_SETUP_TRANSFORMATION = 'Compare current finalized Guard code with BPdpJAw8R4SDh6Wi7dPcXTs5T7ncJDVKCLgzuqZFb15T from the November 12 invoice_06 observation, while retaining historical setup transaction checks; upstream source_sha256 is retained.'


def judge_mainnet_update(sha):
    evidence = f'https://github.com/Cyptopimpinainteazy/x3lang/tree/{sha}/evidence/near-guard-mainnet-invoice06-2026-11-12'
    return (
        '    <p><strong>Recorded mainnet settlement · November 12.</strong> A separate invoice_06 run\n'
        '      accepted a signed official 1Click quote through the restricted NEAR agent key;\n'
        '      25.000000 USDC was deposited on Solana and 24.995200 USDC was delivered to x3lang.near.\n'
        f'      <a href="{evidence}">Inspect the signed quote, finalized transactions and public RPC observation</a>.\n'
        '      This published record is separate from the historical setup check above.</p>\n'
        '    <p><strong>Pending evidence.</strong> The exact .x3 source-to-transaction linkage, control\n'
        '      of the funding wallet, vault custody, and an on-chain hostile-model refusal remain unproved.\n'
        '      The two transfer legs do not prove atomic cross-chain execution.</p>'
    )

EXPORT_CSS = b'<link rel="stylesheet" href="/page-export.css">\n'
EXPORT_CONTROLS = b'<div data-copy-exclude data-page-export-controls class="page-export-controls"><button type="button" data-export-copy>Copy page</button><button type="button" data-export-download>Download Markdown</button><span role="status" aria-live="polite"></span></div>\n'
EXPORT_SCRIPT = b'<script type="module" src="/page-export-controls.mjs"></script>\n'
EXPORT_TRANSFORMATION = 'Add shared public-page Copy and Markdown controls; form values are excluded and upstream source_sha256 is retained.'
EXPORT_SOURCES = {'x3-lang/near/demo/index.html', 'x3-lang/near/demo/judge.html', 'x3-lang/near/demo/bnb.html', 'docs/hackathon/attack-lab.html'}

def add_export_controls(data):
    if any(data.count(marker) != 1 for marker in [b'</head>', b'<body>', b'</body>']):
        raise ValueError('Static lab document structure changed; review before syncing')
    if b'data-page-export-controls' in data:
        raise ValueError('Export controls already present; review before syncing')
    return data.replace(b'</head>', EXPORT_CSS + b'</head>', 1).replace(b'<body>', b'<body>\n' + EXPORT_CONTROLS, 1).replace(b'</body>', EXPORT_SCRIPT + b'</body>', 1)

def remove_export_controls(data):
    return data.replace(EXPORT_CSS, b'').replace(b'<body>\n' + EXPORT_CONTROLS, b'<body>').replace(EXPORT_SCRIPT, b'')

def transform_ported_file(src, data, sha):
    """Apply explicit local changes; source drift requires re-review."""
    transformations = []
    if src in QUOTE_MODE_BINDING_REPLACEMENTS:
        if hashlib.sha256(data).hexdigest() != REVIEWED_QUOTE_MODE_SOURCES.get(src):
            for old, new in QUOTE_MODE_BINDING_REPLACEMENTS[src].items():
                if data.count(old.encode()) != 1 or new.encode() in data:
                    raise ValueError('Quote mode source changed; review before syncing')
                data = data.replace(old.encode(), new.encode(), 1)
            transformations.append(QUOTE_MODE_BINDING_TRANSFORMATION)
    if src == 'x3-lang/near/demo/index.html':
        for old in GUARD_VERDICT_REPLACEMENTS:
            if data.count(old.encode()) != 1:
                raise ValueError('Guard verdict source changed or duplicated; review before syncing')
        for old, new in GUARD_VERDICT_REPLACEMENTS.items():
            data = data.replace(old.encode(), new.encode())
        transformations.append(GUARD_TRANSFORMATION)
    if src == 'x3-lang/near/demo/judge.html':
        if data.count(JUDGE_MAINNET_PENDING.encode()) != 1 or data.count(JUDGE_SCENARIO_BOUNDARY.encode()) != 1:
            raise ValueError('Judge mainnet evidence note changed; review before syncing')
        data = data.replace(JUDGE_MAINNET_PENDING.encode(), judge_mainnet_update(sha).encode(), 1)
        data = data.replace(JUDGE_SCENARIO_BOUNDARY.encode(), JUDGE_SCENARIO_NOTE.encode(), 1)
        for old, new in JUDGE_SETUP_COPY_REPLACEMENTS.items():
            if data.count(old.encode()) != 1:
                raise ValueError('Judge setup label changed; review before syncing')
            data = data.replace(old.encode(), new.encode(), 1)
        transformations.append(JUDGE_MAINNET_TRANSFORMATION)
    if src == 'x3-lang/near/demo/judge/mainnet-setup.mjs':
        for old, new in MAINNET_SETUP_REPLACEMENTS.items():
            if data.count(old.encode()) != 1 or new.encode() in data:
                raise ValueError('Mainnet setup checker changed; review before syncing')
            data = data.replace(old.encode(), new.encode(), 1)
        transformations.append(MAINNET_SETUP_TRANSFORMATION)
    if src == 'docs/hackathon/attack-lab.html':
        old = b'from a clone of this repository, serve its root'
        new = b'from a clone of the X3Lang source repository, serve its root'
        if data.count(old) != 1:
            raise ValueError('Attack Lab instructions changed; review before syncing')
        data = data.replace(old, new)
        transformations.append('Clarify local-server instructions refer to the X3Lang source repository.')
        data = data.replace(b'href="../../evidence/', b'href="https://github.com/Cyptopimpinainteazy/x3lang/blob/' + sha.encode() + b'/evidence/')
        data = data.replace(b'href="FIRST_SWAP_JUDGE_WALKTHROUGH.md"', b'href="https://github.com/Cyptopimpinainteazy/x3lang/blob/' + sha.encode() + b'/docs/hackathon/FIRST_SWAP_JUDGE_WALKTHROUGH.md"')
    if src in EXPORT_SOURCES:
        data = add_export_controls(data)
        transformations.append(EXPORT_TRANSFORMATION)
    return data, transformations


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('checkout', type=Path)
    args = parser.parse_args()
    source = args.checkout.resolve()
    root = Path(__file__).resolve().parents[1]
    sha = subprocess.check_output(['git', '-C', str(source), 'rev-parse', 'HEAD'], text=True).strip()
    if subprocess.check_output(['git', '-C', str(source), 'status', '--porcelain'], text=True).strip():
        raise SystemExit('Refuse a dirty source checkout')
    files = []
    def copy(src, dest):
        data = (source / src).read_bytes()
        target = root / dest
        target.parent.mkdir(parents=True, exist_ok=True)
        original_hash = hashlib.sha256(data).hexdigest()
        data, transformations = transform_ported_file(src, data, sha)
        target.write_bytes(data)
        row = {'source': src, 'destination': dest, 'source_sha256': original_hash, 'sha256': hashlib.sha256(data).hexdigest()}
        if transformations:
            row['local_transformations'] = transformations
        files.append(row)

    modules = ['near_intents', 'near_mandate', 'cli', 'registry', 'numeric', 'typechecker',
               'ed25519', 'chain_evidence', 'helius_evidence', 'track_control']
    for name in modules:
        copy(f'x3-lang/{name}.py', f'vendor/x3lang/x3-lang/{name}.py')
    for name in ['dotx3_workbench', 'mainnet_agent_preflight']:
        copy(f'scripts/hackathon/{name}.py', f'vendor/x3lang/scripts/hackathon/{name}.py')
    for name in ['near_mandate_agent.x3', 'near_intents_agent_payment.x3']:
        copy(f'x3-lang/examples/{name}', f'vendor/x3lang/x3-lang/examples/{name}')
    copy('x3-lang/tests/fixtures/near_intents_tokens.json', 'vendor/x3lang/x3-lang/tests/fixtures/near_intents_tokens.json')
    base = source / 'x3-lang/near/demo'
    for path in sorted(base.rglob('*')):
        rel = path.relative_to(base)
        if (path.is_file() and 'test' not in rel.parts and path.suffix in {'.html', '.mjs', '.json', '.css', '.md'}
                and path.name != 'evidence.json'):
            copy(str(path.relative_to(source)), str(Path('public/labs/guard') / rel))
    for name in ['attack-lab.html', 'attack-lab-policy.mjs']:
        copy('docs/hackathon/' + name, 'public/labs/attack/' + name)
    copy('LICENSE', 'vendor/x3lang/LICENSE')
    manifest = {'schema': 'dotx3.x3lang-port.v1', 'repository': 'Cyptopimpinainteazy/x3lang',
                'commit': sha, 'files': files, 'limits': ['No wallet signing', 'No Phantom/Radar worker port claimed']}
    (root / 'x3lang-port.json').write_text(json.dumps(manifest, indent=2) + '\n')
    (root / 'public/x3lang-port.json').write_text(json.dumps(manifest, indent=2) + '\n')
    attack_files = [row for row in files if row['destination'].startswith('public/labs/attack/')]
    attack_manifest = {
        'repository': manifest['repository'], 'commit': sha,
        'files': attack_files,
        'boundary': 'Offline native-NEAR vault policy preview only. Browser ledger is not on-chain enforcement or settlement.',
        'transformations': list(dict.fromkeys(
            change for row in attack_files for change in row.get('local_transformations', [])
        )),
    }
    (root / 'public/labs/attack/provenance.json').write_text(json.dumps(attack_manifest, indent=2) + '\n')
    print(f'Ported {len(files)} files from {sha}')


if __name__ == "__main__":
    main()
