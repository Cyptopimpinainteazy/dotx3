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

# Reviewed Python and browser adapters at 0aced7e. Both bind dry mode as an
# exact boolean. Unrecognized adapter changes still require review.
REVIEWED_QUOTE_MODE_SOURCES = {
    'x3-lang/near_intents.py': 'c1a28d41d5c2320e45760b9cf1135139abed8f7d44d4c8ea04259dfb0fa0f333',
    'x3-lang/near/demo/x3guard.mjs': '630b6ace1dd6d477884473edc89392ae6ff2d3d6176c501c17f78944088eac43',
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
JUDGE_LAYOUT_REPLACEMENTS = {
    '  .panel.film { margin: 0 0 clamp(14px, 2vw, 22px); }\n'
    '  .panel.film h2 { margin: 0; font-size: 1rem; font-weight: 700; }':
        '  .panel.film, .panel.evidence { margin: 0 0 clamp(14px, 2vw, 22px); }\n'
        '  .panel > header h2 { margin: 0; font-size: 1rem; font-weight: 700; }\n'
        '  .panel.evidence .body > p { margin: 0; }\n'
        '  .panel.evidence .body > .btn { justify-self: start; }',
    '<section class="panel" aria-labelledby="chain-evidence-heading">':
        '<section class="panel evidence" aria-labelledby="chain-evidence-heading">',
    '<header><h2 id="chain-evidence-heading">Cross-chain trade and mainnet setup</h2></header>':
        '<header><h2 id="chain-evidence-heading">Cross-chain trade and mainnet setup</h2></header>\n'
        '    <div class="body">',
    '  </section>\n  <script type="module" src="./judge/mainnet-setup.mjs"></script>':
        '    </div>\n  </section>\n  <script type="module" src="./judge/mainnet-setup.mjs"></script>',
    'aria-describedby="film-note"></video>':
        'aria-labelledby="film-heading" aria-describedby="film-note"></video>',
}
JUDGE_LAYOUT_TRANSFORMATION = 'Use the existing padded panel body and heading style for chain evidence, and label the video with its visible heading; content and media URLs are unchanged.'

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
GUARD_README_REPLACEMENTS = {
    '- `judge/judge.mjs`, `judge/scenarios.json`, `judge/bnb-readiness.json`':
        '- `judge/judge.mjs`, `judge/scenarios.json`, `judge/bnb-readiness.json`, `judge/mainnet-setup.mjs`',
    '- **Each claim is labelled with the evidence behind it.** Only "locally valid policy" holds. The\n'
    '  page states that no approval, deployment, quote, transaction or settlement is behind it.':
        '- **Each claim is labelled with the evidence behind it.** The scenarios establish local policy\n'
        '  results only. Separately, the setup button reads historical setup transactions and current\n'
        '  Guard code from NEAR RPC; the mainnet evidence panel links the recorded invoice_06 settlement.',
}
GUARD_README_TRANSFORMATION = 'Include the read-only setup module in the manual deployment file list and distinguish local scenarios from recorded mainnet evidence; upstream source_sha256 is retained.'


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
        for old, new in JUDGE_LAYOUT_REPLACEMENTS.items():
            if data.count(old.encode()) != 1:
                raise ValueError('Judge panel structure changed; review before syncing')
            data = data.replace(old.encode(), new.encode(), 1)
        transformations.append(JUDGE_LAYOUT_TRANSFORMATION)
    if src == 'x3-lang/near/demo/judge/mainnet-setup.mjs':
        for old, new in MAINNET_SETUP_REPLACEMENTS.items():
            if data.count(old.encode()) != 1 or new.encode() in data:
                raise ValueError('Mainnet setup checker changed; review before syncing')
            data = data.replace(old.encode(), new.encode(), 1)
        transformations.append(MAINNET_SETUP_TRANSFORMATION)
    if src == 'x3-lang/near/demo/README.md':
        for old, new in GUARD_README_REPLACEMENTS.items():
            if data.count(old.encode()) != 1:
                raise ValueError('Guard deployment documentation changed; review before syncing')
            data = data.replace(old.encode(), new.encode(), 1)
        transformations.append(GUARD_README_TRANSFORMATION)
    if src == 'docs/hackathon/attack-lab.html':
        old = b'from a clone of this repository, serve its root'
        new = b'from a clone of the X3Lang source repository, serve its root'
        if data.count(old) != 1:
            raise ValueError('Attack Lab instructions changed; review before syncing')
        data = data.replace(old, new)
        transformations.append('Clarify local-server instructions refer to the X3Lang source repository.')
        data = data.replace(b'href="../../evidence/', b'href="https://github.com/Cyptopimpinainteazy/x3lang/blob/' + sha.encode() + b'/evidence/')
        data = data.replace(b'href="AGENT_LAW_PATH.md"', b'href="https://github.com/Cyptopimpinainteazy/x3lang/blob/' + sha.encode() + b'/docs/hackathon/AGENT_LAW_PATH.md"')
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
               'ed25519', 'chain_evidence', 'helius_evidence', 'track_control', 'agent_law', 'forcefield']
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
    for name in ['attack-lab.html', 'attack-lab-policy.mjs', 'agent-law-proof.html']:
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
    # The playground imports a separate copy of the same upstream Guard.
    browser_assets = {
        'x3-lang/near/demo/x3guard.mjs': 'x3guard.mjs',
        'x3-lang/near/demo/judge/judge.mjs': 'judge/judge.mjs',
        'x3-lang/near/demo/judge/scenarios.json': 'judge/scenarios.json',
        'x3-lang/tests/fixtures/near_intents_quote_dry_live_capture.json': 'fixtures/near_intents_quote_dry_live_capture.json',
        'x3-lang/tests/fixtures/near_intents_quote_dry_implicit_capture.json': 'fixtures/near_intents_quote_dry_implicit_capture.json',
        'LICENSE': 'LICENSE',
    }
    for src, dest in browser_assets.items():
        shutil.copyfile(source / src, root / 'src/lib/x3/vendor' / dest)

    coin_files = [
        'coin/ERC20-5.4.0.sol', 'coin/__init__.py', 'coin/evm.py',
        'coin/examples/dual_vm.json', 'coin/examples/dual_vm.x3',
        'coin/examples/ten_chain_sale.json', 'coin/sale.py', 'coin/svm.py',
        'ed25519.py', 'emitter/_keccak.py',
    ]
    coin_rows = []
    for name in coin_files:
        src = 'x3-lang/' + name
        dest = 'vendor/x3lang/' + src
        data = (source / src).read_bytes()
        (root / dest).write_bytes(data)
        coin_rows.append({'source': src, 'destination': dest, 'sha256': hashlib.sha256(data).hexdigest()})
    coin_manifest = {'repository': manifest['repository'], 'commit': sha, 'files': coin_rows}
    (root / 'public/labs/coin-sources.json').write_text(json.dumps(coin_manifest, indent=2) + '\n')
    print(f'Ported {len(files)} files from {sha}')


if __name__ == "__main__":
    main()
