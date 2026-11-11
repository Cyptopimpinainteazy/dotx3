"""Vercel Python API: bounded, same-origin real .x3 compiler; no network calls."""
from http.server import BaseHTTPRequestHandler
import json
from pathlib import Path
import sys
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'vendor/x3lang/scripts/hackathon'))
from dotx3_workbench import compile_sources, MAX_BODY


class handler(BaseHTTPRequestHandler):
    def log_message(self, *_args):
        pass

    def reply(self, status, result):
        raw = json.dumps(result, default=str).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(raw)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.end_headers()
        self.wfile.write(raw)

    def do_POST(self):
        origin = self.headers.get('Origin')
        host = self.headers.get('Host')
        if (self.headers.get('Sec-Fetch-Site') == 'cross-site'
                or (origin and urlsplit(origin).netloc != host)):
            return self.reply(403, {'error': 'Same-origin requests only'})
        try:
            if self.headers.get('Content-Type', '').split(';')[0] != 'application/json':
                return self.reply(415, {'error': 'application/json required'})
            if self.headers.get('Transfer-Encoding'):
                return self.reply(400, {'error': 'Transfer encoding unsupported'})
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= MAX_BODY:
                return self.reply(413, {'error': 'Request too large or empty'})
            report = compile_sources(json.loads(self.rfile.read(length)))
            return self.reply(200, report)
        except (ValueError, TypeError, KeyError, UnicodeError):
            return self.reply(400, {'error': 'Invalid bounded public .x3 input'})
        except Exception:
            return self.reply(500, {'error': 'Compiler unavailable; no authorization produced'})
