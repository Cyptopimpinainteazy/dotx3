#!/usr/bin/env python3
"""Port allowlisted X3Lang demos/compiler from a clean pinned checkout."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

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
    if src == 'docs/hackathon/attack-lab.html':
        data = data.replace(b'href="../../evidence/', b'href="https://github.com/Cyptopimpinainteazy/x3lang/blob/' + sha.encode() + b'/evidence/')
        data = data.replace(b'href="FIRST_SWAP_JUDGE_WALKTHROUGH.md"', b'href="https://github.com/Cyptopimpinainteazy/x3lang/blob/' + sha.encode() + b'/docs/hackathon/FIRST_SWAP_JUDGE_WALKTHROUGH.md"')
    target.write_bytes(data)
    files.append({'source': src, 'destination': dest, 'source_sha256': original_hash, 'sha256': hashlib.sha256(data).hexdigest()})

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
