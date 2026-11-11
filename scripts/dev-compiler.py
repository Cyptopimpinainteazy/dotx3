#!/usr/bin/env python3
"""Development-only compiler API; loopback, public source only."""
from http.server import ThreadingHTTPServer
import importlib.util
from pathlib import Path
spec = importlib.util.spec_from_file_location('dotx3_api', Path(__file__).resolve().parents[1] / 'api/compile.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
ThreadingHTTPServer(('127.0.0.1', 8794), module.handler).serve_forever()
