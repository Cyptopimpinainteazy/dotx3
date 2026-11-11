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

def transform_ported_file(src, data, sha):
    """Apply reviewed local presentation changes; source drift requires re-review."""
    transformations = []
    if src == 'x3-lang/near/demo/index.html':
        for old in GUARD_VERDICT_REPLACEMENTS:
            if data.count(old.encode()) != 1:
                raise ValueError('Guard verdict source changed or duplicated; review before syncing')
        for old, new in GUARD_VERDICT_REPLACEMENTS.items():
            data = data.replace(old.encode(), new.encode())
        transformations.append(GUARD_TRANSFORMATION)
    if src == 'docs/hackathon/attack-lab.html':
        old = b'from a clone of this repository, serve its root'
        new = b'from a clone of the X3Lang source repository, serve its root'
        if data.count(old) != 1:
            raise ValueError('Attack Lab instructions changed; review before syncing')
        data = data.replace(old, new)
        transformations.append('Clarify local-server instructions refer to the X3Lang source repository.')
        data = data.replace(b'href="../../evidence/', b'href="https://github.com/Cyptopimpinainteazy/x3lang/blob/' + sha.encode() + b'/evidence/')
        data = data.replace(b'href="FIRST_SWAP_JUDGE_WALKTHROUGH.md"', b'href="https://github.com/Cyptopimpinainteazy/x3lang/blob/' + sha.encode() + b'/docs/hackathon/FIRST_SWAP_JUDGE_WALKTHROUGH.md"')
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
    print(f'Ported {len(files)} files from {sha}')


if __name__ == "__main__":
    main()
