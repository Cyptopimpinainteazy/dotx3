#!/usr/bin/env python3
"""Launch Codex with this project's MCP settings and an in-memory API key."""
import getpass
import json
import os
from pathlib import Path
import shutil
import sys
import tomllib


def toml_value(value):
    if isinstance(value, dict):
        return '{' + ', '.join(json.dumps(k) + ' = ' + toml_value(v) for k, v in value.items()) + '}'
    if isinstance(value, bool):
        return str(value).lower()
    if isinstance(value, (str, int, float)):
        return json.dumps(value)
    raise ValueError('Unsupported MCP configuration value')


def main():
    root = Path(__file__).resolve().parents[1]
    server = tomllib.loads((root / '.codex/config.toml').read_text())['mcp_servers']['near_builders']
    executable = shutil.which('codex')
    if not executable:
        raise SystemExit('Codex CLI is not installed')
    key = os.environ.get('NEAR_BUILDERS_API_KEY')
    if not key:
        if not sys.stdin.isatty():
            raise SystemExit('Set NEAR_BUILDERS_API_KEY in the runtime environment or use an interactive terminal')
        key = getpass.getpass('NEAR Builders API key (not saved): ')
    if not key.strip():
        raise SystemExit('NEAR_BUILDERS_API_KEY is empty')
    args = [executable]
    for name, value in server.items():
        args.extend(['-c', 'mcp_servers.near_builders.' + name + '=' + toml_value(value)])
    args.extend(sys.argv[1:])
    environment = dict(os.environ, NEAR_BUILDERS_API_KEY=key)
    os.chdir(root)
    os.execvpe(executable, args, environment)


if __name__ == '__main__':
    main()
