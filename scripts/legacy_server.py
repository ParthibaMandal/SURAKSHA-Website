#!/usr/bin/env python3
"""
SURAKSHA Local Website Server
Supports both static asset serving (HTML, CSS, SVG, JSON) and local API bridge endpoints.
"""
import http.server
import socketserver
import os
import sys
import json
import urllib.parse

PORT = int(os.environ.get('PORT', 3000))
HOST = os.environ.get('HOST', '127.0.0.1')
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8',
}

class SurakshaHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def end_headers(self):
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('Access-Control-Allow-Origin', f'http://{HOST}:{PORT}')
        super().end_headers()

    def do_GET(self):
        url = urllib.parse.urlparse(self.path)
        path = url.path

        if path == '/api/site/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            payload = {
                "status": "ok",
                "backend_configured": False,
                "local_demo_enabled": True,
                "mode": "standalone local server"
            }
            self.wfile.write(json.dumps(payload).encode('utf-8'))
            return

        if path == '/api/flood/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            payload = {
                "status": "HEALTHY",
                "operational_readiness": "LOCAL_SIMULATION",
                "readiness_blockers": []
            }
            self.wfile.write(json.dumps(payload).encode('utf-8'))
            return

        if path == '/' or path == '':
            path = '/index.html'

        rel_path = path.lstrip('/')
        full_path = os.path.abspath(os.path.join(ROOT_DIR, rel_path))

        if not full_path.startswith(ROOT_DIR):
            self.send_error(403, "Forbidden")
            return

        if not os.path.exists(full_path) or os.path.isdir(full_path):
            if not os.path.splitext(full_path)[1]:
                full_path = os.path.join(ROOT_DIR, 'index.html')
            else:
                self.send_error(404, "File Not Found")
                return

        ext = os.path.splitext(full_path)[1].lower()
        content_type = MIME_TYPES.get(ext, 'application/octet-stream')

        try:
            with open(full_path, 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, f"Internal Error: {str(e)}")

def run():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer((HOST, PORT), SurakshaHandler) as httpd:
        print(f"SURAKSHA website running at http://{HOST}:{PORT}")
        print("Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == '__main__':
    run()

