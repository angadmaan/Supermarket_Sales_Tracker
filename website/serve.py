"""
Simple local server for the Supermarket Sales Tracker showcase website.

Usage:
    python3 serve.py

Opens http://localhost:8000 in your default browser automatically.
Press Ctrl+C to stop the server.
"""

import http.server
import webbrowser
import os

# Change to the directory where this script lives (the website folder)
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORT = 8000
URL = f"http://localhost:{PORT}"

print(f"\n🛒 Supermarket Sales Tracker — Showcase Website")
print(f"   Serving at: {URL}")
print(f"   Press Ctrl+C to stop.\n")

# Open in browser
webbrowser.open(URL)

# Start server
handler = http.server.SimpleHTTPRequestHandler
with http.server.HTTPServer(("", PORT), handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✅ Server stopped. Goodbye!")
