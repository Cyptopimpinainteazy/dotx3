#!/usr/bin/env python3
"""Append a Python compiler Function to Nitro's Vercel Build Output."""
import json
from pathlib import Path
import shutil
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
output = root / '.vercel/output'
function = output / 'functions/api/compile.func'
function.mkdir(parents=True, exist_ok=True)
shutil.copytree(root / 'vendor', function / 'vendor', dirs_exist_ok=True,
                ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
(function / 'api').mkdir(exist_ok=True)
shutil.copy2(root / 'api/compile.py', function / 'api/compile.py')
subprocess.run([sys.executable, '-m', 'pip', 'install', '--disable-pip-version-check',
                '--quiet', '--target', str(function / 'python'), 'vercel-runtime==0.24.2'], check=True)
(function / 'vc__handler__python.py').write_text('''import os, site
from pathlib import Path
here = Path(__file__).resolve().parent
site.addsitedir(str(here / "python"))
os.environ.update({
    "__VC_HANDLER_MODULE_NAME": "api.compile",
    "__VC_HANDLER_ENTRYPOINT": "api/compile.py",
    "__VC_HANDLER_ENTRYPOINT_ABS": str(here / "api/compile.py"),
    "__VC_HANDLER_VENDOR_DIR": "python",
    "__VC_HANDLER_VARIABLE_NAME": "handler",
})
from vercel_runtime.vc_init import vc_handler
''')
(function / '.vc-config.json').write_text(json.dumps({'runtime': 'python3.12',
    'handler': 'vc__handler__python.vc_handler', 'maxDuration': 10,
    'supportsResponseStreaming': True}) + '\n')
config = json.loads((output / 'config.json').read_text())
# Explicitly route the TanStack DEX API ahead of Vercel's native /api handling.
config['routes'].insert(0, {'src': '/api/x3dex/(.*)', 'dest': '/__server'})
config['routes'].insert(0, {'src': '/api/compile', 'dest': '/api/compile'})
(output / 'config.json').write_text(json.dumps(config, indent=2) + '\n')
print('Packaged bounded .x3 compiler Function')
