#!/usr/bin/env python3
"""Local static server that serves text files as UTF-8."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import mimetypes
import os


class UTF8Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **getattr(SimpleHTTPRequestHandler, "extensions_map", {}),
        ".txt": "text/plain; charset=utf-8",
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml; charset=utf-8",
        ".md": "text/markdown; charset=utf-8",
    }

    def guess_type(self, path):
        # Prefer our UTF-8 mappings for common text types.
        base, ext = os.path.splitext(path)
        ext = ext.lower()
        if ext in self.extensions_map:
            return self.extensions_map[ext]
        ctype = super().guess_type(path)
        if ctype.startswith("text/") and "charset=" not in ctype:
            return f"{ctype}; charset=utf-8"
        return ctype


def main():
    port = int(os.environ.get("PORT", "5173"))
    root = os.path.dirname(os.path.abspath(__file__))
    handler = partial(UTF8Handler, directory=root)
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    print(f"Serving {root} at http://127.0.0.1:{port}")
    print(f"llms.txt -> http://127.0.0.1:{port}/llms.txt")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    # Ensure .txt is registered with charset for guess_type fallbacks.
    mimetypes.add_type("text/plain; charset=utf-8", ".txt")
    main()
